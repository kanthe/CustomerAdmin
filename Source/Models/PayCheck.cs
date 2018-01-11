using System;
using System.Collections.Generic;

namespace CustomerAdminPortal.Models
{
    public partial class PayCheck
    {
        public int PayCheckRef { get; set; }
        public int? CustomerNumber { get; set; }
        public int? HotelRef { get; set; }
        public string HotelName { get; set; }
        public string Customer { get; set; }
        public DateTime PeriodDate { get; set; }
        public int Persons { get; set; }
        public DateTime? LogDate { get; set; }
        public int? CustomerRef { get; set; }
        public string HotelAbbreviation { get; set; }
        public bool? Invoiced { get; set; }
        public bool? FromMail { get; set; }
        public string InvoiceCustomerId { get; set; }
        public string Dbname { get; set; }
        public int? MailCustomerNumber { get; set; }
        public int? CustomerRefOld { get; set; }

        public virtual Customer CustomerRefNavigation { get; set; }
    }
}
