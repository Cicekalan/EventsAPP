using Microsoft.EntityFrameworkCore;
using UserApi.Models;

namespace UserApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<User>()
                .Property(e => e.FullName)
                .HasColumnName("fullname");
            modelBuilder.Entity<User>()
                .Property(e => e.Id)
                .HasColumnName("id");
            modelBuilder.Entity<User>()
                .Property(e => e.Email)
                .HasColumnName("email");
            modelBuilder.Entity<User>()
                .Property(e => e.Password)
                .HasColumnName("password");
            modelBuilder.Entity<User>()
                .Property(e => e.UserName)
                .HasColumnName("username");
            modelBuilder.Entity<User>()
                .Property(e => e.ProfilePicturePath)
                .HasColumnName("profilepicturepath");
        }

    }
}