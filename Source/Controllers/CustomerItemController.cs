using CustomerAdminPortal.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace CustomerAdminPortal.Controllers
{
    [Route("api/[controller]")]
    public class CustomerItemController : Controller
    {
        public CustomerAdminContext Database { get; private set; }

        public CustomerItemController([FromServices] CustomerAdminContext db)
        {
            this.Database = db;
        }

        [HttpGet("[action]")]
        public IEnumerable<CustomerItem> GetOne(int customerItemRef)
        {
            var response = Database.CustomerItem
                .Where(c => c.CustomerItemRef == customerItemRef);

            return response;
        }

        [HttpPut("[action]")]
        public IEnumerable<string> Update([FromBody] CustomerItem customerItem)
        {
            var item = new CustomerItem();
            List<string> flag = new List<string>() { "Fel inträffade vid databasuppdatering" };

            if (customerItem.CustomerItemRef == 0)
            {
                var newCustomerItem = Insert(customerItem);
                item = newCustomerItem;
                flag[0] = "Ny artikel tillagd";
            }
            else
            {
                var originalCustomerItem = Database.CustomerItem.Find(customerItem.CustomerItemRef);

                if (originalCustomerItem != null)
                {
                    originalCustomerItem = SetValues(originalCustomerItem, customerItem);
                    Database.SaveChanges();
                    item = originalCustomerItem;
                    flag[0] = "Artikel uppdaterad";
                }
            }
            return flag;
        }

        public CustomerItem Insert(CustomerItem customerItem)
        {
            var newCustomerItem = SetValues(new CustomerItem(), customerItem);
            Database.CustomerItem.Add(newCustomerItem);
            Database.SaveChanges();
            return newCustomerItem;
        }

        private CustomerItem SetValues(CustomerItem newCustomerItem, CustomerItem customerItem)
        {
            newCustomerItem.CustomerRef = customerItem.CustomerRef;
            newCustomerItem.ItemPerHotel = customerItem.ItemPerHotel;
            newCustomerItem.ItemRef = customerItem.ItemRef;
            newCustomerItem.FromDate = customerItem.FromDate;
            newCustomerItem.UntilDate = customerItem.UntilDate;
            newCustomerItem.MinAmountPerMonth = customerItem.MinAmountPerMonth;
            newCustomerItem.MaxAmountPerMonth = customerItem.MaxAmountPerMonth;
            newCustomerItem.PricePerItem = customerItem.PricePerItem;
            newCustomerItem.Invoicetext = customerItem.Invoicetext;
            newCustomerItem.Comment = customerItem.Comment;
            newCustomerItem.InvoiceMonth = customerItem.InvoiceMonth;
            newCustomerItem.PrePaidMonths = customerItem.PrePaidMonths;

            return newCustomerItem;
        }

        [HttpDelete("[action]")]
        public void Delete(int customerItemRef)
        {
            var customerItemToRemove = Database.CustomerItem
                .Where(ci => ci.CustomerItemRef == customerItemRef)
                .SingleOrDefault();
            Database.CustomerItem.Remove(customerItemToRemove);
            Database.SaveChanges();
        }
    }
}
