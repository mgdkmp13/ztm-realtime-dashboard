using Microsoft.EntityFrameworkCore;
using ztmApp.Models;

namespace ztmApp.Data
{

    public class AppDbContext : DbContext
    {
        public DbSet<User> Users => Set<User>();
        public DbSet<Stop> Stops => Set<Stop>();

        public AppDbContext(DbContextOptions<AppDbContext> opts) : base(opts)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.OwnsOne(u => u.Login, login =>
                {
                    login.Property(l => l.Value).HasColumnName("Login").IsRequired();
                });

                entity.OwnsOne(u => u.HashPassword, hash =>
                {
                    hash.Property(h => h.Value).HasColumnName("HashPassword").IsRequired();
                });

                entity.HasMany(u => u.Stops)
                    .WithOne(s => s.User)
                    .HasForeignKey(s => s.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Stop>(entity =>
            {
                entity.OwnsOne(s => s.StopId, stopId =>
                {
                    stopId.Property(si => si.Value).HasColumnName("StopId").IsRequired();
                });

                entity.OwnsOne(s => s.StopDesc, stopDesc =>
                {
                    stopDesc.Property(sd => sd.Value).HasColumnName("StopDesc").IsRequired();
                });
            });
        }
    }
}