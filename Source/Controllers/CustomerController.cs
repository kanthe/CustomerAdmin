using CustomerAdminPortal.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace CustomerAdminPortal.Controllers
{
    [Route("api/[controller]")]
    public class CustomerController : Controller
    {
        public CustomerAdminContext Database { get; private set; }

        public CustomerController([FromServices] CustomerAdminContext db)
        {
            this.Database = db;
        }

        [HttpGet("[action]")]
        public IEnumerable<Customer> GetAll()
        {
            var refs = (Database.Customer.Select(c => c.CustomerRef)).ToList();
            var customers = GetCustomers(refs);

            return customers;
        }

        [HttpGet("[action]")]
        public IEnumerable<Customer> GetOne(int customerRef)
        {
            var customer = GetCustomers(new List<int>() { customerRef});

            return customer;
        }

        public IEnumerable<Customer> GetCustomers(List<int> customerRefs)
        {
            var customers = Database.Customer
                .Where(c => customerRefs.Contains(c.CustomerRef))
                .Select(c => new Customer
                {
                    CustomerRef = c.CustomerRef,
                    CustomerName = c.CustomerName,
                    WebAdress = c.DatabaseName != null && c.DatabaseName.StartsWith("TP-") ? "https://"
                        + c.DatabaseName.Substring(3, c.DatabaseName.Length - 3).ToLower() + ".timeplan.se" : "",
                    CustomerNumber = c.CustomerNumber,
                    FortnoxNumber = c.FortNoxNumber,
                    Version = c.Version,
                    SalarySystem = c.SalarySystem,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    Comment = c.Comment,
                    DatabaseName = c.DatabaseName,
                    ServerName = c.ServerName,
                    QuotedMaxEmployee = c.QuotedMaxEmployees,
                    Hotels = Database.PayCheck
                        .Where(pc => pc.CustomerRef == c.CustomerRef)
                        .Select(pc => pc.HotelName)
                        .Distinct()
                        .ToList()
                }).ToList();

            return customers;
        }

        [HttpPut("[action]")]
        public IEnumerable<string> Update([FromBody] Customer customer)
        {
            var cust = new Models.Customer();
            List<string> flag = new List<string>() {
                "Fel inträffade vid databasuppdatering"
            };

            if (customer.CustomerRef == 0)
            {
                var newCustomer = Insert(customer);
                cust = newCustomer;
                flag[0] = "Ny kund tillagd";
            }
            else
            {
                var originalCustomer = Database.Customer.Find(customer.CustomerRef);

                if (originalCustomer != null)
                {
                    originalCustomer.CustomerName = customer.CustomerName;
                    originalCustomer.CustomerNumber = customer.CustomerNumber;
                    originalCustomer.FortNoxNumber = customer.FortnoxNumber;
                    originalCustomer.Comment = customer.Comment;
                    originalCustomer.QuotedMaxEmployees = customer.QuotedMaxEmployee;
                    Database.SaveChanges();
                    cust = originalCustomer;
                    flag[0] = "Kund uppdaterad";
                }
            }

            return flag.AsQueryable<string>();
        }

        public Models.Customer Insert(Customer customer)
        {
            var newCustomer = new Models.Customer();
            newCustomer.CustomerName = customer.CustomerName;
            newCustomer.CustomerNumber = customer.CustomerNumber;
            newCustomer.FortNoxNumber = customer.FortnoxNumber;
            newCustomer.Comment = customer.Comment;
            newCustomer.QuotedMaxEmployees = customer.QuotedMaxEmployee;
            Database.Customer.Add(newCustomer);
            Database.SaveChanges();
            return newCustomer;
        }

        [HttpDelete("[action]")]
        public void Delete(int customerRef)
        {
            var payChecksToRemove = Database.PayCheck
                .Where(pc => pc.CustomerRef == customerRef)
                .ToList();

            foreach (PayCheck pc in payChecksToRemove)
            {
                Database.PayCheck.Remove(pc);
            }

            var invoiceToRemove = Database.Invoice
                .Where(iv => iv.CustomerRef == customerRef)
                .ToList();

            foreach (Invoice iv in invoiceToRemove)
            {
                Database.Invoice.Remove(iv);
            }

            var invoiceLineToRemove = Database.InvoiceLine
                .Where(il => il.CustomerRef == customerRef)
                .ToList();

            foreach (InvoiceLine il in invoiceLineToRemove)
            {
                Database.InvoiceLine.Remove(il);
            }

            var customerItemsToRemove = Database.CustomerItem
                .Where(ci => ci.CustomerRef == customerRef)
                .ToList();

            foreach (CustomerItem ci in customerItemsToRemove)
            {
                Database.CustomerItem.Remove(ci);
            }
            Database.SaveChanges();

            var customerToRemove = Database.Customer.Find(customerRef);
            Database.Customer.Remove(customerToRemove);
            Database.SaveChanges();
        }

        [HttpGet("[action]")]
        public IEnumerable<CustomerItem> GetAllOneCustomer(int customerRef)
        {
            var response = Database.CustomerItem
                .Where(ci => ci.CustomerRef == customerRef)
                .Select(ci => new CustomerItem
                {
                    CustomerItemRef = customerRef,
                    PricePerItem = ci.PricePerItem
                });
            return response;
        }

        [HttpGet("[action]")]
        public IEnumerable<CustomerAndItems> GetCustomerAndItems(int customerRef)
        {
            var response = Database.Customer
                .Where(c => c.CustomerRef == customerRef)
                .Select(c => new CustomerAndItems
                {
                    Customer = GetOne(customerRef).Single(),
                    Items = c.CustomerItem.Select(ci => new CustomerItem
                    {
                        CustomerItemRef = ci.CustomerItemRef,
                        CustomerRef = customerRef,
                        ItemPerHotel = ci.ItemPerHotel,
                        ItemRef = ci.ItemRef,
                        FromDate = ci.FromDate,
                        UntilDate = ci.UntilDate,
                        MinAmountPerMonth = ci.MinAmountPerMonth,
                        MaxAmountPerMonth = ci.MaxAmountPerMonth,
                        PricePerItem = ci.PricePerItem,
                        Invoicetext = ci.Invoicetext,
                        Comment = ci.Comment,
                        InvoiceMonth = ci.InvoiceMonth,
                        PrePaidMonths = ci.PrePaidMonths
                    })
                    .ToList()
                });
            return response;
        }

        public class CustomerAndItems
        {
            public Customer Customer;
            public List<CustomerItem> Items;
        }

        public class Customer
        {
            public int CustomerRef { get; set; }
            public string CustomerName { get; set; }
            public string WebAdress { get; set; }
            public int? CustomerNumber { get; set; }
            public int? FortnoxNumber { get; set; }
            public string SalarySystem { get; set; }
            public System.DateTime? StartDate { get; set; }
            public System.DateTime? EndDate { get; set; }
            public string Comment { get; set; }
            public string DatabaseName { get; set; }
            public string ServerName { get; set; }
            public string Version { get; set; }
            public int? QuotedMaxEmployee { get; set; }
            public List<string> Hotels { get; set; }
        }
    }
}
