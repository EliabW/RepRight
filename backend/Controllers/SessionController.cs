using System.Text.Json;
using backend.Data;
using backend.DTOs;
using backend.Filters;
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
    /// Get all sessions for the logged in user
    /// </summary>
    /// <status code="200">Returns the sessions</status>
    /// <status code="401">If the user is not authenticated</status>
    /// <status code="404">If the user is not found</status>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SessionResponse>>> GetSessions()
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

        // First, get the raw sessions from the database
        var sessionsData = await _context
            .Sessions.Where(s => s.UserID == userId)
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
                RepScores =
                    s.RepScores != null
                        ? JsonSerializer.Deserialize<List<double>>(s.RepScores)
                        : null,
            })
            .ToList();

        return Ok(sessions);
    }

    /// <summary>
    /// Create a session for the logged in user
    /// </summary>
    /// <status code="200">Returns the sessions</status>
    /// <status code="401">If the user is not authenticated</status>
    /// <status code="404">If the user is not found</status>
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
            SessionReps = request.SessionReps ?? 0,
            SessionScore = request.SessionScore ?? 0.0,
            SessionFeedback = request.SessionFeedback ?? "",
            SessionDurationSec = request.SessionDurationSec ?? 0,
            RepScores =
                request.RepScores != null ? JsonSerializer.Serialize(request.RepScores) : null,
        };

        _context.Sessions.Add(session);
        await _context.SaveChangesAsync();

        return Ok(
            new SessionResponse
            {
                SessionID = session.SessionID,
                SessionType = session.SessionType,
                StartTime = session.StartTime,
                SessionReps = session.SessionReps,
                SessionScore = session.SessionScore,
                SessionFeedback = session.SessionFeedback,
                SessionDurationSec = session.SessionDurationSec,
                RepScores =
                    session.RepScores != null
                        ? JsonSerializer.Deserialize<List<double>>(session.RepScores)
                        : null,
            }
        );
    }

    /// <summary>
    /// Get a certain session from the logged in user
    /// </summary>
    /// <status code="200">Returns the session</status>
    /// <status code="401">If the user is not authenticated</status>
    /// <status code="404">If the session is not found or not accessible</status>
    [HttpGet("{id}")]
    public async Task<ActionResult<SessionResponse>> GetSession(int id)
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

        return Ok(
            new SessionResponse
            {
                SessionID = session.SessionID,
                SessionType = session.SessionType,
                StartTime = session.StartTime,
                SessionReps = session.SessionReps,
                SessionScore = session.SessionScore,
                SessionFeedback = session.SessionFeedback,
                SessionDurationSec = session.SessionDurationSec,
                RepScores =
                    session.RepScores != null
                        ? JsonSerializer.Deserialize<List<double>>(session.RepScores)
                        : null,
            }
        );
    }

    /// <summary>
    /// Update a session for the logged in user
    /// </summary>
    /// <status code="200">Returns the updated session</status>
    /// <status code="401">If the user is not authenticated</status>
    /// <status code="404">If the session is not found or not accessible</status>
    [HttpPut("{id}")]
    public async Task<ActionResult<SessionResponse>> UpdateSession(
        int id,
        UpdateSessionRequest request
    )
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

        session.SessionType = request.SessionType ?? session.SessionType;
        session.StartTime = request.StartTime ?? session.StartTime;
        session.SessionReps = request.SessionReps ?? session.SessionReps;
        session.SessionScore = request.SessionScore ?? session.SessionScore;
        session.SessionFeedback = request.SessionFeedback ?? session.SessionFeedback;
        session.SessionDurationSec = request.SessionDurationSec ?? session.SessionDurationSec;

        await _context.SaveChangesAsync();

        return Ok(
            new SessionResponse
            {
                SessionID = session.SessionID,
                SessionType = session.SessionType,
                StartTime = session.StartTime,
                SessionReps = session.SessionReps,
                SessionScore = session.SessionScore,
                SessionFeedback = session.SessionFeedback,
                SessionDurationSec = session.SessionDurationSec,
            }
        );
    }

    /// <summary>
    /// Delete a session for the logged in user
    /// </summary>
    /// <status code="200">Returns success message</status>
    /// <status code="401">If the user is not authenticated</status>
    /// <status code="404">If the session is not found or not accessible</status>
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
}
