using System;
using System.Collections.Generic;

namespace CustomerAdminPortal.Models
{
    public partial class InvoiceLine
    {
        public int InvoiceLineRef { get; set; }
        public int InvoiceRef { get; set; }
        public int CustomerRef { get; set; }
        public int ItemRef { get; set; }
        public decimal PricePerItem { get; set; }
        public int Quantity { get; set; }
        public string Description { get; set; }

        public virtual Customer CustomerRefNavigation { get; set; }
        public virtual Invoice InvoiceRefNavigation { get; set; }
        public virtual Item ItemRefNavigation { get; set; }
    }
}
