using backend.Models;

namespace backend.Helpers;

public static class StreakHelper
{
    public static void UpdateLoginStreak(User user)
    {
        var today = DateTime.UtcNow.Date;
        var lastLogin = user.LastLoginDateTime?.Date;

        if (lastLogin == null)
        {
            user.CurrentStreak = 1;
            user.LongestStreak = 1;
        }
        else if (lastLogin == today)
        {
            return;
        }
        else
        {
            var daysSinceLastLogin = (today - lastLogin.Value).Days;

            if (daysSinceLastLogin == 1)
            {
                user.CurrentStreak++;
                user.LongestStreak = Math.Max(user.CurrentStreak, user.LongestStreak);
            }
            else
            {
                user.CurrentStreak = 1;
            }
        }
    }
}
