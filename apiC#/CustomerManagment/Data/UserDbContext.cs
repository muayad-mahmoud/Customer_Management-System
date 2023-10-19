using CustomerManagment.Models;
using Microsoft.EntityFrameworkCore;

namespace CustomerManagment.Data
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options): base(options) 
        {
        }
        public DbSet<User> Users { get; set; }
    }
}
