using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Sessions> Sessions { get; set; }
    public DbSet<Rep> Reps { get; set; }
    public DbSet<Frame> Frames { get; set; }
}
