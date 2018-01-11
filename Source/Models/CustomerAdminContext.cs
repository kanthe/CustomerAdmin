using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CustomerAdminPortal.Models
{
    public partial class CustomerAdminContext : DbContext
    {

        public virtual DbSet<Customer> Customer { get; set; }
        public virtual DbSet<CustomerItem> CustomerItem { get; set; }
        public virtual DbSet<Invoice> Invoice { get; set; }
        public virtual DbSet<InvoiceLine> InvoiceLine { get; set; }
        public virtual DbSet<Item> Item { get; set; }
        public virtual DbSet<PayCheck> PayCheck { get; set; }

        // Unable to generate entity type for table 'dbo.IgnoreDatabase'. Please see the warning messages.
        // Unable to generate entity type for table 'dbo.InvoicePeriod'. Please see the warning messages.
        // Unable to generate entity type for table 'dbo.EventLog'. Please see the warning messages.

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.CustomerRef)
                    .HasName("PK_Customer");

                entity.Property(e => e.CustomerRef).ValueGeneratedOnAdd();

                entity.Property(e => e.Comment).HasColumnType("varchar(500)");

                entity.Property(e => e.CustomerName).HasColumnType("varchar(100)");

                entity.Property(e => e.DatabaseName).HasColumnType("varchar(50)");

                entity.Property(e => e.EndDate).HasColumnType("date");

                entity.Property(e => e.SalarySystem).HasColumnType("varchar(50)");

                entity.Property(e => e.ServerName).HasColumnType("varchar(50)");

                entity.Property(e => e.StartDate).HasColumnType("date");

                entity.Property(e => e.Version).HasColumnType("varchar(50)");

                entity.HasOne(d => d.CustomerRefNavigation)
                    .WithOne(p => p.InverseCustomerRefNavigation)
                    .HasForeignKey<Customer>(d => d.CustomerRef)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Customer_Customer");
            });

            modelBuilder.Entity<CustomerItem>(entity =>
            {
                entity.HasKey(e => e.CustomerItemRef)
                    .HasName("PK_CustomerItem");

                entity.HasIndex(e => e.ItemRef)
                    .HasName("IX_CustomerItem_1");

                entity.HasIndex(e => new { e.CustomerRef, e.HotelRef, e.ItemRef })
                    .HasName("IX_CustomerItem_3");

                entity.HasIndex(e => new { e.CustomerRef, e.FromDate, e.UntilDate, e.ItemRef })
                    .HasName("IX_CustomerItem");

                entity.HasIndex(e => new { e.PrePaidMonths, e.HotelRef, e.FromDate, e.UntilDate })
                    .HasName("IX_CustomerItem_2");

                entity.Property(e => e.ChangedBy).HasColumnType("varchar(50)");

                entity.Property(e => e.Comment).HasColumnType("varchar(500)");

                entity.Property(e => e.FromDate).HasColumnType("date");

                entity.Property(e => e.Invoicetext).HasColumnType("varchar(500)");

                entity.Property(e => e.ItemPerHotel).HasDefaultValueSql("1");

                entity.Property(e => e.MaxAmountPerMonth).HasColumnType("money");

                entity.Property(e => e.MinAmountPerMonth).HasColumnType("money");

                entity.Property(e => e.PricePerItem).HasColumnType("money");

                entity.Property(e => e.UntilDate).HasColumnType("date");

                entity.HasOne(d => d.CustomerRefNavigation)
                    .WithMany(p => p.CustomerItem)
                    .HasForeignKey(d => d.CustomerRef)
                    .HasConstraintName("FK_CustomerItem_Customer");
            });

            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.HasKey(e => e.InvoiceRef)
                    .HasName("PK_Invoice");

                entity.Property(e => e.CreateDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("getdate()");

                entity.Property(e => e.InvoiceDate).HasColumnType("date");

                entity.Property(e => e.PeriodEnd).HasColumnType("date");

                entity.Property(e => e.PeriodStart).HasColumnType("date");

                entity.HasOne(d => d.CustomerRefNavigation)
                    .WithMany(p => p.Invoice)
                    .HasForeignKey(d => d.CustomerRef)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Invoice_Customer");
            });

            modelBuilder.Entity<InvoiceLine>(entity =>
            {
                entity.HasKey(e => e.InvoiceLineRef)
                    .HasName("PK_InvoiceLine");

                entity.Property(e => e.Description).HasColumnType("varchar(500)");

                entity.Property(e => e.PricePerItem).HasColumnType("money");

                entity.HasOne(d => d.CustomerRefNavigation)
                    .WithMany(p => p.InvoiceLine)
                    .HasForeignKey(d => d.CustomerRef)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_InvoiceLine_Customer");

                entity.HasOne(d => d.InvoiceRefNavigation)
                    .WithMany(p => p.InvoiceLine)
                    .HasForeignKey(d => d.InvoiceRef)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_InvoiceLine_InvoiceLine");

                entity.HasOne(d => d.ItemRefNavigation)
                    .WithMany(p => p.InvoiceLine)
                    .HasForeignKey(d => d.ItemRef)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_InvoiceLine_Item");
            });

            modelBuilder.Entity<Item>(entity =>
            {
                entity.HasKey(e => e.ItemRef)
                    .HasName("PK_Item");

                entity.Property(e => e.ItemRef).ValueGeneratedNever();

                entity.Property(e => e.Abbreviation).HasColumnType("varchar(50)");

                entity.Property(e => e.Comment).HasColumnType("varchar(500)");

                entity.Property(e => e.Description).HasColumnType("varchar(500)");
            });

            modelBuilder.Entity<PayCheck>(entity =>
            {
                entity.HasKey(e => e.PayCheckRef)
                    .HasName("PK_Paycheck");

                entity.HasIndex(e => new { e.PeriodDate, e.CustomerRef, e.HotelRef })
                    .HasName("IX_PayCheck");

                entity.Property(e => e.Customer).HasColumnType("varchar(50)");

                entity.Property(e => e.CustomerRefOld).HasColumnName("CustomerRefOLD");

                entity.Property(e => e.Dbname)
                    .HasColumnName("DBName")
                    .HasColumnType("varchar(250)");

                entity.Property(e => e.HotelAbbreviation).HasColumnType("varchar(50)");

                entity.Property(e => e.HotelName).HasColumnType("varchar(50)");

                entity.Property(e => e.InvoiceCustomerId).HasColumnType("varchar(50)");

                entity.Property(e => e.LogDate).HasColumnType("datetime");

                entity.Property(e => e.PeriodDate).HasColumnType("date");

                entity.HasOne(d => d.CustomerRefNavigation)
                    .WithMany(p => p.PayCheck)
                    .HasForeignKey(d => d.CustomerRef)
                    .HasConstraintName("FK_Paycheck_Customer");
            });
        }
    }
}