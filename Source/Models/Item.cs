using System;
using System.Collections.Generic;

namespace CustomerAdminPortal.Models
{
    public partial class Item
    {
        public Item()
        {
            InvoiceLine = new HashSet<InvoiceLine>();
        }

        public int ItemRef { get; set; }
        public string Description { get; set; }
        public string Comment { get; set; }
        public int? ItemId { get; set; }
        public string Abbreviation { get; set; }

        public virtual ICollection<InvoiceLine> InvoiceLine { get; set; }
    }
}
