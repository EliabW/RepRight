using System.Text.Json;
using backend.Data;
using backend.DTOs;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SessionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public SessionsController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all sessions for the logged in user (without frame data)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SessionResponse>>> GetSessions()
    {
        var userId = User.GetUserId();

        if (userId == null)
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        var sessionsData = await _context
            .Sessions.Where(s => s.UserID == userId)
            .Include(s => s.Reps) // Include reps but not frames
            .OrderByDescending(s => s.StartTime)
            .ToListAsync();

        var sessions = sessionsData
            .Select(s => new SessionResponse
            {
                SessionID = s.SessionID,
                SessionType = s.SessionType,
                StartTime = s.StartTime,
                SessionReps = s.SessionReps,
                SessionScore = s.SessionScore,
                SessionFeedback = s.SessionFeedback,
                SessionDurationSec = s.SessionDurationSec,
                Reps = s
                    .Reps?.Select(r => new RepResponse
                    {
                        RepID = r.RepID,
                        RepNumber = r.RepNumber,
                        RepScore = r.RepScore,
                        Frames = null, // Don't include frames in list view
                    })
                    .OrderBy(r => r.RepNumber)
                    .ToList(),
            })
            .ToList();

        return Ok(sessions);
    }

    /// <summary>
    /// Get a specific session with all rep and frame data (for replay)
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<SessionResponse>> GetSession(int id)
    {
        var userId = User.GetUserId();

        if (userId == null)
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        var session = await _context
            .Sessions.Include(s => s.Reps)
                .ThenInclude(r => r.Frames) // Include frames for replay
            .FirstOrDefaultAsync(s => s.SessionID == id);

        if (session == null || session.UserID != userId.Value)
        {
            return NotFound(new { message = "Session not found or not accessible." });
        }

        return Ok(MapSessionToResponse(session, includeFrames: true));
    }

    /// <summary>
    /// Get frames for a specific rep (for replay)
    /// </summary>
    [HttpGet("{sessionId}/reps/{repNumber}/frames")]
    public async Task<ActionResult<List<FrameResponse>>> GetRepFrames(int sessionId, int repNumber)
    {
        var userId = User.GetUserId();

        if (userId == null)
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        var session = await _context.Sessions.FindAsync(sessionId);
        if (session == null || session.UserID != userId.Value)
        {
            return NotFound(new { message = "Session not found or not accessible." });
        }

        var rep = await _context
            .Reps.Include(r => r.Frames)
            .FirstOrDefaultAsync(r => r.SessionID == sessionId && r.RepNumber == repNumber);

        if (rep == null)
        {
            return NotFound(new { message = "Rep not found." });
        }

        var frames = rep.Frames?.OrderBy(f => f.FrameNumber).Select(MapFrameToResponse).ToList();

        return Ok(frames ?? new List<FrameResponse>());
    }

    /// <summary>
    /// Create a session with reps and frames
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<SessionResponse>> CreateSession(CreateSessionRequest request)
    {
        var userId = User.GetUserId();

        if (userId == null)
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        var user = await _context.Users.FindAsync(userId.Value);
        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        var session = new Sessions
        {
            UserID = userId.Value,
            SessionType = request.SessionType,
            StartTime = request.StartTime ?? DateTime.UtcNow,
            SessionReps = request.SessionReps ?? request.Reps?.Count ?? 0,
            SessionScore =
                request.SessionScore
                ?? (request.Reps?.Any() == true ? request.Reps.Average(r => r.RepScore ?? 0) : 0),
            SessionFeedback = request.SessionFeedback ?? "",
            SessionDurationSec = request.SessionDurationSec ?? 0,
            Reps = request
                .Reps?.Select(r => new Rep
                {
                    RepNumber = r.RepNumber,
                    RepScore = r.RepScore,
                    Frames = r
                        .Frames?.Select(f => new Frame
                        {
                            FrameNumber = f.FrameNumber,
                            Nose = SerializeKeypoint(f.Nose),
                            LeftEye = SerializeKeypoint(f.LeftEye),
                            RightEye = SerializeKeypoint(f.RightEye),
                            LeftEar = SerializeKeypoint(f.LeftEar),
                            RightEar = SerializeKeypoint(f.RightEar),
                            LeftShoulder = SerializeKeypoint(f.LeftShoulder),
                            RightShoulder = SerializeKeypoint(f.RightShoulder),
                            LeftElbow = SerializeKeypoint(f.LeftElbow),
                            RightElbow = SerializeKeypoint(f.RightElbow),
                            LeftWrist = SerializeKeypoint(f.LeftWrist),
                            RightWrist = SerializeKeypoint(f.RightWrist),
                            LeftHip = SerializeKeypoint(f.LeftHip),
                            RightHip = SerializeKeypoint(f.RightHip),
                            LeftKnee = SerializeKeypoint(f.LeftKnee),
                            RightKnee = SerializeKeypoint(f.RightKnee),
                            LeftAnkle = SerializeKeypoint(f.LeftAnkle),
                            RightAnkle = SerializeKeypoint(f.RightAnkle),
                        })
                        .ToList()!,
                })
                .ToList()!,
        };

        _context.Sessions.Add(session);
        await _context.SaveChangesAsync();

        // Reload with all related data
        var createdSession = await _context
            .Sessions.Include(s => s.Reps)
                .ThenInclude(r => r.Frames)
            .FirstOrDefaultAsync(s => s.SessionID == session.SessionID);

        return Ok(MapSessionToResponse(createdSession!, includeFrames: false));
    }

    /// <summary>
    /// Delete a session (cascades to reps and frames)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteSession(int id)
    {
        var userId = User.GetUserId();

        if (userId == null)
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        var session = await _context.Sessions.FindAsync(id);

        if (session == null || session.UserID != userId.Value)
        {
            return NotFound(new { message = "Session not found or not accessible." });
        }

        _context.Sessions.Remove(session);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Session deleted successfully." });
    }

    // Helper methods
    private string? SerializeKeypoint(KeypointData? keypoint)
    {
        if (keypoint == null)
            return null;
        return JsonSerializer.Serialize(keypoint);
    }

    private KeypointData? DeserializeKeypoint(string? json)
    {
        if (string.IsNullOrEmpty(json))
            return null;
        return JsonSerializer.Deserialize<KeypointData>(json);
    }

    private SessionResponse MapSessionToResponse(Sessions session, bool includeFrames)
    {
        return new SessionResponse
        {
            SessionID = session.SessionID,
            SessionType = session.SessionType,
            StartTime = session.StartTime,
            SessionReps = session.SessionReps,
            SessionScore = session.SessionScore,
            SessionFeedback = session.SessionFeedback,
            SessionDurationSec = session.SessionDurationSec,
            Reps = session
                .Reps?.Select(r => new RepResponse
                {
                    RepID = r.RepID,
                    RepNumber = r.RepNumber,
                    RepScore = r.RepScore,
                    Frames = includeFrames
                        ? r.Frames?.OrderBy(f => f.FrameNumber).Select(MapFrameToResponse).ToList()
                        : null,
                })
                .OrderBy(r => r.RepNumber)
                .ToList(),
        };
    }

    private FrameResponse MapFrameToResponse(Frame frame)
    {
        return new FrameResponse
        {
            FrameID = frame.FrameID,
            FrameNumber = frame.FrameNumber,
            Nose = DeserializeKeypoint(frame.Nose),
            LeftEye = DeserializeKeypoint(frame.LeftEye),
            RightEye = DeserializeKeypoint(frame.RightEye),
            LeftEar = DeserializeKeypoint(frame.LeftEar),
            RightEar = DeserializeKeypoint(frame.RightEar),
            LeftShoulder = DeserializeKeypoint(frame.LeftShoulder),
            RightShoulder = DeserializeKeypoint(frame.RightShoulder),
            LeftElbow = DeserializeKeypoint(frame.LeftElbow),
            RightElbow = DeserializeKeypoint(frame.RightElbow),
            LeftWrist = DeserializeKeypoint(frame.LeftWrist),
            RightWrist = DeserializeKeypoint(frame.RightWrist),
            LeftHip = DeserializeKeypoint(frame.LeftHip),
            RightHip = DeserializeKeypoint(frame.RightHip),
            LeftKnee = DeserializeKeypoint(frame.LeftKnee),
            RightKnee = DeserializeKeypoint(frame.RightKnee),
            LeftAnkle = DeserializeKeypoint(frame.LeftAnkle),
            RightAnkle = DeserializeKeypoint(frame.RightAnkle),
        };
    }
}
