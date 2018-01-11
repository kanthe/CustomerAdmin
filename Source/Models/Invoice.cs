using System;
using System.Collections.Generic;

namespace CustomerAdminPortal.Models
{
    public partial class Invoice
    {
        public Invoice()
        {
            InvoiceLine = new HashSet<InvoiceLine>();
        }

        public int InvoiceRef { get; set; }
        public int CustomerRef { get; set; }
        public DateTime InvoiceDate { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
        public int? Temporary { get; set; }
        public DateTime? CreateDate { get; set; }

        public virtual ICollection<InvoiceLine> InvoiceLine { get; set; }
        public virtual Customer CustomerRefNavigation { get; set; }
    }
}
