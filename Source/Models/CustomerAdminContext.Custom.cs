namespace CustomerAdminPortal.Models
{
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class CustomerAdminContext
    {
        public CustomerAdminContext(DbContextOptions<CustomerAdminContext> options)
            : base(options)
        { }
    }
}
