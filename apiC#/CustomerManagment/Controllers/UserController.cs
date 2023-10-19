using CustomerManagment.Data;
using CustomerManagment.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CustomerManagment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserDbContext _context;
        public UserController(UserDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IEnumerable<User>> getData([FromQuery] int start, [FromQuery] int count)
        {
            if (start != null && count != null)
            {
                return await _context.Users.Skip(start).Take(count).ToListAsync();
            }
            else
            {
                return await _context.Users.ToListAsync();
            }

        }
        [HttpGet("id")]
        [ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> getuser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            return user == null ? NotFound() : Ok(user);
        }

        [HttpPost("upload")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> dataRegister()
        {
            User tempUser = new User();


            try
            {

                var formAttributes = Request.Form;

                string format = "ddd MMM dd yyyy HH:mm:ss 'GMT'zzz '(Eastern European Summer Time)'";

                if (DateTime.TryParseExact(formAttributes["StartDate"], format, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out DateTime result) && DateTime.TryParseExact(formAttributes["EndDate"], format, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out DateTime result1))
                {
                    // Parsing was successful, and the result variable now contains the DateTime.
                    tempUser.StartDate = result.ToUniversalTime();
                    tempUser.EndDate = result1.ToUniversalTime();
                }
                else
                {
                    throw new Exception("Cant Parse Date");
                }

                tempUser.Location = formAttributes["location"];
                tempUser.PPhone = (int)Convert.ToInt64(formAttributes["pPhone"]);
                tempUser.bname = formAttributes["bname"];
                tempUser.company = formAttributes["company"];
                tempUser.taxNo = (int)Convert.ToInt64(formAttributes["taxNo"]);
                tempUser.PName = formAttributes["pName"];
                tempUser.Logo = formAttributes.Files.Where(x => x.Name == "logo").First().FileName;
                tempUser.Images = new List<string>();
                foreach (var file in formAttributes.Files.Where(x => x.Name != "logo"))
                {
                    tempUser.Images.Add(file.FileName);
                }
                await _context.Users.AddAsync(tempUser);
                await _context.SaveChangesAsync();
                var files = Request.Form.Files;
                if (files.Count != 0)
                {
                    var userFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads", tempUser.Id.ToString());
                    if (Directory.Exists(userFolder))
                    {
                        foreach (var file in files)
                        {
                            string filename = file.FileName;
                            var filePath = Path.Combine(userFolder, filename);
                            using (var stream = new FileStream(filePath, FileMode.Create))
                            {
                                await file.CopyToAsync(stream);
                            }
                        }
                    }
                    else
                    {
                        Directory.CreateDirectory(userFolder);
                        foreach (var file in files)
                        {
                            string filename = file.FileName;
                            //check for userFolder


                            var filePath = Path.Combine(userFolder, filename);
                            using (var stream = new FileStream(filePath, FileMode.Create))
                            {
                                await file.CopyToAsync(stream);
                            }


                        }
                    }

                }
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> deleteUser(int id)
        {
            var userToDelete = await _context.Users.FindAsync(id);
            if (userToDelete == null) return NotFound();
            _context.Users.Remove(userToDelete);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpGet("uploads/{fileName}")]
        public IActionResult GetUploadedFile(string fileName)
        {
            string ID = fileName.Split(':')[1];
            fileName = fileName.Split(':')[0];
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads", ID);
            var filePath = Path.Combine(uploadsFolder, fileName);

            if (System.IO.File.Exists(filePath))
            {
                var fileStream = new FileStream(filePath, FileMode.Open);
                return File(fileStream, "application/octet-stream");
            }
            else
            {
                return NotFound("File not found");
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id)
        {

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            var formAttributes = Request.Form;
            User tempUser = new User
            {
                Id = id,
                Location = formAttributes["location"],
                PPhone = int.Parse(formAttributes["pPhone"]),
                bname = formAttributes["bname"],
                company = formAttributes["company"],
                taxNo = int.Parse(formAttributes["taxNo"]),
                PName = formAttributes["pName"],
            };
            //Delete non existent photos
            var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            string[] filenames = Directory.GetFiles(uploadFolder);
            for (int i = 0; i < filenames.Length; i++)
            {
                var filename = Path.GetFileName(filenames[i]);
                filenames[i] = filename;
            }
            var intersection = filenames.Intersect(formAttributes["images"]).ToList();
            intersection.Add(formAttributes["logo"]);

            foreach (var image in filenames)
            {

                if (intersection.Contains(image))
                {
                    continue;
                }
                else
                {
                    var filePath = Path.Combine(uploadFolder, image);
                    System.IO.File.Delete(filePath);
                }

            }
            //end Delete Non Existent Photos
            if (formAttributes.Files.Count > 0)
            {
                var files = Request.Form.Files;
                if (files.Count != 0)
                {
                    foreach (var file in files)
                    {
                        string filename = file.FileName;
                        var upload = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
                        var filePath = Path.Combine(upload, filename);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }


                    }
                }
                tempUser.Logo = formAttributes.Files.Where(x => x.Name == "logo").First().FileName;
                if (tempUser.Images != null)
                {

                    foreach (var file in formAttributes.Files.Where(x => x.Name != "logo"))
                    {
                        tempUser.Images.Add(file.FileName);
                    }
                    foreach (var image in intersection)
                    {
                        tempUser.Images.Add(image);
                    }

                }
                else
                {
                    tempUser.Images = new List<string>();
                    foreach (var file in formAttributes.Files.Where(x => x.Name != "logo"))
                    {
                        tempUser.Images.Add(file.FileName);
                    }
                }
                try
                {
                    string format = "ddd MMM dd yyyy HH:mm:ss 'GMT'zzz '(Eastern European Summer Time)'";

                    if (DateTime.TryParseExact(formAttributes["startDate"], format, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out DateTime result) && DateTime.TryParseExact(formAttributes["endDate"], format, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out DateTime result1))
                    {
                        // Parsing was successful, and the result variable now contains the DateTime.
                        tempUser.StartDate = result.ToUniversalTime();
                        tempUser.EndDate = result1.ToUniversalTime();
                    }
                    else
                    {
                        throw new Exception("Cant Parse Date");
                    }
                }
                catch (Exception ex)
                {
                    tempUser.StartDate = Convert.ToDateTime(formAttributes["startDate"]);
                    tempUser.EndDate = Convert.ToDateTime(formAttributes["endDate"]);
                }
                _context.Entry(tempUser).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok();
            }
            else
            {
                _context.Entry(tempUser).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }

        }
    }
}
