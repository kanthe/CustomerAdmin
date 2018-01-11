using System;
using System.Collections.Generic;

namespace CustomerAdminPortal.Models
{
    public partial class Customer
    {
        public Customer()
        {
            CustomerItem = new HashSet<CustomerItem>();
            Invoice = new HashSet<Invoice>();
            InvoiceLine = new HashSet<InvoiceLine>();
            PayCheck = new HashSet<PayCheck>();
        }

        public int CustomerRef { get; set; }
        public int? CustomerNumber { get; set; }
        public int? FortNoxNumber { get; set; }
        public string CustomerName { get; set; }
        public int? HotelRef { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Comment { get; set; }
        public string DatabaseName { get; set; }
        public string ServerName { get; set; }
        public string Version { get; set; }
        public int? QuotedMaxEmployees { get; set; }
        public string SalarySystem { get; set; }
        public int? EmplAccordingToCustomer { get; set; }

        public virtual ICollection<CustomerItem> CustomerItem { get; set; }
        public virtual ICollection<Invoice> Invoice { get; set; }
        public virtual ICollection<InvoiceLine> InvoiceLine { get; set; }
        public virtual ICollection<PayCheck> PayCheck { get; set; }
        public virtual Customer CustomerRefNavigation { get; set; }
        public virtual Customer InverseCustomerRefNavigation { get; set; }
    }
}
