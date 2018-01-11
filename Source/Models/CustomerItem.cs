using System;
using System.Collections.Generic;

namespace CustomerAdminPortal.Models
{
    public partial class CustomerItem
    {
        public int CustomerItemRef { get; set; }
        public int? CustomerRef { get; set; }
        public int? HotelRef { get; set; }
        public bool ItemPerHotel { get; set; }
        public int ItemRef { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? UntilDate { get; set; }
        public decimal? MinAmountPerMonth { get; set; }
        public decimal? MaxAmountPerMonth { get; set; }
        public decimal? PricePerItem { get; set; }
        public string Invoicetext { get; set; }
        public string ChangedBy { get; set; }
        public string Comment { get; set; }
        public int? PrePaidMonths { get; set; }
        public int? InvoiceMonth { get; set; }

        public virtual Customer CustomerRefNavigation { get; set; }
    }
}
