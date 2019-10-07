using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Google.Maps;
using Google.Maps.Geocoding;
using System.Windows.Forms;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Globalization;
using MetadataExtractor;
using System.Runtime.Serialization;
using ImageMagick;
using Mehroz;
using System.Collections;
using System.Threading;
using System.Diagnostics;
//using System.Runtime.Serialization;

namespace Dater_Geotagger.Functions
{
    class CheckLocation
    {
        private static byte[] lati, longi;
        private static string privLatRef, privLongiRef, privDT;

        public static bool isLocValid(string address)
        {

            GoogleSigned.AssignAllServices(new GoogleSigned("AIzaSyDQCsm0cw2szALwQuXC3n1fDf71hcVUo6M"));

            var request = new GeocodingRequest();
            //request.Address = "1600 Pennsylvania Ave NW, Washington, DC 20500";
            request.Address = address;
            var response = new GeocodingService().GetResponse(request);

            //The GeocodingService class submits the request to the API web service, and returns the
            //response strongly typed as a GeocodeResponse object which may contain zero, one or more results.

            //Assuming we received at least one result, let's get some of its properties:
            if (response.Status == ServiceResponseStatus.Ok && response.Results.Count() > 0)
            {
                var result = response.Results.First();

                Variables.Locs.pubLat = result.Geometry.Location.Latitude;
                lati = doubleToDegrees(result.Geometry.Location.Latitude);

                //result.Geometry.Location.Latitude.

                Variables.Locs.pubLong = result.Geometry.Location.Longitude;

                longi = doubleToDegrees(result.Geometry.Location.Longitude);
                //Console.WriteLine("Latitude to: \n");
                Variables.Locs.pubLati = rationalValue(Variables.Locs.pubLat);
                //Console.WriteLine("Longitude to: \n");
                Variables.Locs.pubLongi = rationalValue(Variables.Locs.pubLong);

                Variables.Locs.pubLatref = (int)Variables.Locs.pubLat >= 0 ? "N" : "S";

                privLatRef = (int)Variables.Locs.pubLat >= 0 ? "N" : "S";

                privLongiRef = (int)Variables.Locs.pubLong >= 0 ? "E" : "W";

                privDT = DateTime.Now.ToString("yyyy:MM:dd hh:mm:ssK\0");

                //Console.WriteLine($"Lat: {Variables.Locs.pubLat}\nLongi: {Variables.Locs.pubLong}\nDegrees Lati: {lati}\nDegrees Longi: {longi}");

                Variables.Locs.pubLongref = (int)Variables.Locs.pubLong >= 0 ? "E" : "W";

                return true;
            }

            else
            {
                Console.WriteLine("Unable to geocode.  Status={0} and ErrorMessage={1}", response.Status, response.ErrorMessage);
                return false;
            }

            //return false;
        }

        //[SYNCH]
        public static bool insertGPS(string fileName, /*double lat, double longi*/ ImageMagick.Rational[] rLat, ImageMagick.Rational[] rLongi)
        {
            bool result = false;
            string nameFile = System.IO.Path.GetFileName(fileName);
            Console.WriteLine(nameFile);
            string directory = System.IO.Path.GetDirectoryName(fileName);
            Console.WriteLine(directory);
            //GetChildAtPointSkip pa

            //Stopwatch nw = new Stopwatch();
            //nw.Start();

            try
            {
                using (MagickImage image = new MagickImage(fileName/* + "[0]"*/))
                {
                    //Process currentProcess = Process.GetCurrentProcess();
                    //MagickImage temp = image;

                    //File.Delete(fileName);
                    //image.RemoveWriteMask
                    //Console.WriteLine(image.TotalColors);

                    Console.WriteLine($"DISK: {ResourceLimits.Disk} MEM: {ResourceLimits.Memory} THREAD: {ResourceLimits.Thread} THROTTLE: {ResourceLimits.Throttle}");
                    //ResourceLimits.Memory = 1000000000;
                    // Retrieve the exif information
                    //image.Ping(fileName+"[0]");
                    //ImageMagick.iden
                    //File.Delete(fileName);
                    ExifProfile profile = image.GetExifProfile();

                    //profile.RemoveValue(ExifTag.DateTime);
                    //Thread.Sleep(300);
                    //image.
                    //Check if image contains an exif profile
                    if (profile == null)
                    {
                        profile = new ExifProfile();
                    }

                    Console.WriteLine($"Processing {fileName}\n");

                    //Console.WriteLine(ThreadState.Running);

                    profile.SetValue(ExifTag.DateTime, DateTime.Now.ToString("yyyy:MM:dd hh:mm:ssK"));
                    profile.SetValue(ExifTag.DateTimeOriginal, Variables.Locs.pubDateTime + "00:00");
                    profile.SetValue(ExifTag.GPSLatitude, rLat);
                    //profile.SetValue(ExifTag.GPSLatitude, lati);
                    profile.SetValue(ExifTag.GPSLongitude, rLongi);
                    //profile.SetValue(ExifTag.GPSLatitude, longi);
                    profile.SetValue(ExifTag.GPSLatitudeRef, privLatRef/*Variables.Locs.pubLatref*/);
                    profile.SetValue(ExifTag.GPSLongitudeRef, privLongiRef/*Variables.Locs.pubLongref*/);
                    
                    image.AddProfile(profile);
                    //image.AutoOrient();
                    //image.Warning();

                    //Console.WriteLine($"Elapsed: {nw.ElapsedMilliseconds}");
                    try
                    {

                        //Thread.Sleep(100);
                        //image.re
                        image.Write(directory + @"\__OUTPUT\" + nameFile);
                        //image.Write(fileName + "new.jpg");
                        image?.Dispose();
                        //File.Delete(fileName + ".tmp");
                        result = true;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("\n" + ex.ToString());
                        result = false;
                        //File.Delete(fileName);
                        //return;
                    }
                    //finally
                    //{
                    //    //return;
                    //    //break;
                    //}
                }
                return result;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
                return false;
            }
        }

        private static ImageMagick.Rational[] rationalValue(double val)
        {
            ImageMagick.Rational[] rationals = new ImageMagick.Rational[3];

            double mins = ((val - Math.Truncate(val) / 1) * 60);
            double secs = ((mins - Math.Truncate(mins) / 1) * 60);

            //rationals[0] = ImageMagick.Rational.FromDouble(Math.Truncate(val));
            //rationals[1] = ImageMagick.Rational.FromDouble(Math.Truncate(mins));
            //rationals[2] = ImageMagick.Rational.FromDouble(secs);

            //Console.WriteLine($"Orig formula:\n Degrees: {Math.Truncate(val)} Minutes: {Math.Truncate(mins)} Seconds: {secs}");

            double deg = Math.Abs(val);

            double geoMin = ((deg - Math.Truncate(deg) / 1) * 60);

            double geoSec = ((geoMin - Math.Truncate(geoMin) / 1) * 60);

            //Console.WriteLine($"Value: {val}\nNew formula:\n Degrees: {Math.Truncate(deg)} Minutes: {Math.Truncate(geoMin)} Seconds: {Math.Round(geoSec, 4)}");

            rationals[0] = ImageMagick.Rational.FromDouble(Math.Truncate(deg));

            //rationals[0] = deg == 0 ? ImageMagick.Rational.FromDouble(deg) : ImageMagick.Rational.FromDouble(Math.Truncate(deg));


            //rationals[1] = ImageMagick.Rational.FromDouble(Math.Truncate(geoMin));

            rationals[1] = Math.Truncate(geoMin) == 0 ? ImageMagick.Rational.FromDouble(geoMin) : ImageMagick.Rational.FromDouble(Math.Truncate(geoMin));


            rationals[2] = ImageMagick.Rational.FromDouble(geoSec);

            Console.WriteLine($"rational 1: {rationals[1]}");
            //double geoMin

            //Console.WriteLine($"Degrees: {rationals[0]} \nMinutes: {rationals[1]} \nSeconds: {rationals[2]}");

            //double deg;

            //deg = Math.Abs(geocode);

            return rationals;
        }

        public static void checkProps(string fileName) //Need to freaking figure out kung papano makukuha ng maayos yung property Item na tulad ng ginagawa ng picasa
        {
            using (MemoryStream ms = new MemoryStream(File.ReadAllBytes(fileName)))
            {
                //File.Delete(fileName);
                using (Image Pic = Image.FromStream(ms))
                {
                    Console.WriteLine(privDT);
                    //DateTimeDigitized = 0x9004 modifed date ID Type: || Type: 2= ascii
                    //DateTimeOriginal = 0x9003 camera date || Type: 2= ascii
                    //GPSLatitudeRef = 0x0001,|| Type: 2= ascii
                    //GPSLongitudeRef = 0x0003, || Type: 2= ascii
                    //GPSLatitude = 0x0002,
                    //GPSLongitude = 0x0004

                    PropertyItem pi = Pic.PropertyItems[0];

                    pi.Id = 0x9003; //Camera date and file date
                    pi.Type = 2;
                    pi.Len = 26;
                    pi.Value = ASCIIEncoding.ASCII.GetBytes(Variables.Locs.pubDateTime + "00:00\0");
                    //Pic.SetPropertyItem(pi);

                    pi.Id = 0x0132; //Modified date
                    pi.Type = 2;
                    pi.Len = 26;
                    pi.Value = ASCIIEncoding.ASCII.GetBytes(privDT);
                    //Pic.SetPropertyItem(pi);

                    pi.Id = 0x0004; //Longitude
                    pi.Type = 5;
                    pi.Len = longi.Length;
                    pi.Value = longi;
                    //Pic.SetPropertyItem(pi);

                    pi.Id = 0x0003; //LongitudeRef
                    pi.Type = 2;
                    pi.Len = 2;
                    pi.Value = Encoding.ASCII.GetBytes(privLongiRef);
                    //Pic.SetPropertyItem(pi);

                    pi.Id = 0x0001; //LatitudeRef
                    pi.Type = 2;
                    pi.Len = 2;
                    pi.Value = Encoding.ASCII.GetBytes(privLatRef);
                    //Pic.SetPropertyItem(pi);


                    pi.Id = 0x0002; //Latitude
                    pi.Type = 5;
                    pi.Len = lati.Length;
                    pi.Value = lati;
                    Pic.SetPropertyItem(pi);

                    Pic.Save(fileName);

                    Pic.Dispose();
                    //Thread.Sleep(100);

                    //foreach (PropertyItem pi in Pic.PropertyItems)
                    //{
                    //    Console.WriteLine("ID: " + pi.Id);
                    //    Console.WriteLine("Length: " + pi.Len);
                    //    Console.WriteLine("Type: " + pi.Type);
                    //    Console.Write("Value: " + pi.Value);
                    //    switch (pi.Type)
                    //    {
                    //        case 1:
                    //            //Console.WriteLine(byteToFloat(pi.Value));
                    //            Console.WriteLine(Encoding.UTF8.GetString(pi.Value));
                    //            break;

                    //        case 2:
                    //            Console.WriteLine(Encoding.UTF8.GetString(pi.Value));
                    //            break;

                    //        case 3:
                    //            //Console.WriteLine(Decimal.Parse(string.Format("{0}", /*byteToDouble(pi.Value)*/123.456), NumberStyles.Any, CultureInfo.InvariantCulture));
                    //            string hehe = "";
                    //            foreach (byte b in pi.Value)
                    //            {
                    //                hehe += b;
                    //            }
                    //            //byte[] data = File.ReadAllBytes(pi.Value.ToString());

                    //            string result = System.Text.Encoding.UTF8.GetString(pi.Value).TrimEnd('\0');


                    //            Console.WriteLine(result);
                    //            break;

                    //        default:
                    //            break;
                    //    }
                    //    Console.WriteLine("");
                    //}
                }
            }
        }

        private static byte[] FloatToExifGps(int degrees, int minutes, double seconds)
        {
            //Console.WriteLine($"Degrees {degrees}\nMinutes: {minutes}\nSeconds: {seconds}");
            var secBytes = BitConverter.GetBytes(seconds);
            var secDivisor = BitConverter.GetBytes(100);
            byte[] rv = { (byte)degrees, 0, 0, 0, 1, 0, 0, 0, (byte)minutes, 0, 0, 0, 1, 0, 0, 0, secBytes[0], secBytes[1], 0, 0, secDivisor[0], 0, 0, 0 };
            return rv;
        }

        public static byte[] doubleToDegrees(double geocode)
        {
            //double[] result = new double[3];
            byte[] result = new byte[3];

            double deg;

            //string latDir = (lat >= 0 ? "N" : "S");
            //lat = Math.Abs(lat);
            deg = Math.Abs(geocode);
            //double latMinPart = ((lat - Math.Truncate(lat) / 1) * 60);
            double geoMin = ((deg - Math.Truncate(deg) / 1) * 60);

            double geoSec = ((geoMin - Math.Truncate(geoMin) / 1) * 60);
            //double latSecPart = ((latMinPart - Math.Truncate(latMinPart) / 1) * 60);

            //string lonDir = (lon >= 0 ? "E" : "W");
            //lon = Math.Abs(lon);
            //double lonMinPart = ((lon - Math.Truncate(lon) / 1) * 60);
            //double lonSecPart = ((lonMinPart - Math.Truncate(lonMinPart) / 1) * 60);

            //result[0] = Math.Truncate(deg);
            //result[1] = Math.Truncate(geoMin);
            //result[2] = geoSec;



            result = FloatToExifGps((int)Math.Truncate(deg), (int)Math.Truncate(geoMin), (int)Math.Truncate(geoSec * 100));

            //foreach (byte res in result)
            //{
            //    Console.WriteLine(res);
            //}

            //Console.WriteLine(geoSec * 100);

            return result;
            //Console.WriteLine(
            //    Math.Truncate(lat) + " " + Math.Truncate(latMinPart) + " " + Math.Truncate(latSecPart) + " " + latDir
            //    );

            //Console.WriteLine(
            //    Math.Truncate(lon) + " " + Math.Truncate(lonMinPart) + " " + Math.Truncate(lonSecPart) + " " + lonDir
            //    );
        }

        public class WorkItem
        {
            //this produces a task for us
            List<string> files;
            string fileName;
            //Variables.Locs.pubLati, Variables.Locs.pubLongi

            private TaskCompletionSource<string> completionSource;

            public Task<string> DoWork(string file)
            {
                //create a new source of tasks
                fileName = file;
                //Console.WriteLine($"file count: {file.Count}");
                if (files != null) { files.Clear(); }

                //files = file.ToList();
                this.completionSource = new TaskCompletionSource<string>();
                //start work going using ***Thread class****...
                new Thread(this.PerformWork).Start();
                //...however, return a task from the source to the caller
                //so they get to work with the easy to use Task.
                //We are providing a Task facade around the operation
                //running on the dedicated thread

                return this.completionSource.Task;
            }

            private void PerformWork()
            {
                /*Thread.Sleep(100)*/
                //do work here..
                //Console.WriteLine("Test123");
                //insertGPS(fileName, Variables.Locs.pubLati, Variables.Locs.pubLongi);
                //for (int i = 0; i < files.Count(); i++)
                //{
                //    insertGPS(files[i], Variables.Locs.pubLati, Variables.Locs.pubLongi);
                //}
                //set result of the Task here, which completes the task
                //and thus schedules any callbacks the called registered
                //with ContinueWith to run
                this.completionSource.SetResult($"Done Metadata Insert");
            }
        }

        /// <summary>
        /// Change/Add standard EXIF field vlaue
        /// </summary>
        /// <param name="file"></param>
        /// <param name="objExifInfo"></param>
        /// <returns></returns>
        //    public static bool ChangeImageExif(string file, EXIFInfo objExifInfo)
        //    {
        //        #region Vars
        //        string sPropValue = string.Empty;
        //        EXIFBase.ExifField field;
        //        PropertyItem propItem = null;
        //        ImageFormat ifOriginal = null;
        //        Graphics gSave = null;
        //        Image iOriginal = null;
        //        Image iSave = null;
        //        #endregion

        //        try
        //        {
        //            iOriginal = new Bitmap(file);
        //            ifOriginal = iOriginal.RawFormat;

        //            // For each EXIFField in objExifInfo, add it to Image EXIF
        //            foreach (var exField in objExifInfo)
        //            {
        //                field = (EXIFBase.ExifField)Enum.Parse(typeof(EXIFBase.ExifField), exField.Key.ToString());
        //                try
        //                {
        //                    // Get the EXIF value from Image
        //                    propItem = iOriginal.GetPropertyItem((int)field);
        //                    sPropValue = System.Text.Encoding.UTF8.GetString(propItem.Value);

        //                    //Change the value
        //                    sPropValue = sPropValue.Replace(sPropValue, exField.Value);

        //                    // Get bytes
        //                    propItem.Value = System.Text.Encoding.UTF8.GetBytes(sPropValue);

        //                    //Set the property on the image
        //                    iOriginal.SetPropertyItem(propItem);
        //                }
        //                catch (System.ArgumentException)
        //                {
        //                    // EXIF tag doesn't exist, add it to image
        //                    WriteEXIFField(iOriginal, field, exField.Value.ToString() + "\0");
        //                }
        //            }
        //            //Store the list of properties that exist on the image
        //            ArrayList alPropertyItems = new ArrayList();

        //            foreach (PropertyItem pi in iOriginal.PropertyItems)
        //                alPropertyItems.Add(pi);

        //            //Create temp image
        //            iSave = new Bitmap(iOriginal.Width, iOriginal.Height, iOriginal.PixelFormat);

        //            //Copy the original image over to the temp image
        //            gSave = Graphics.FromImage(iSave);

        //            //If you check iSave at this point, it does not have any EXIF properties -
        //            //only the image gets recreated
        //            gSave.DrawImage(iOriginal, 0, 0, iOriginal.Width, iOriginal.Height);

        //            //Get rid of the locks on the original image
        //            iOriginal.Dispose();
        //            gSave.Dispose();

        //            //Copy the original EXIF properties to the new image
        //            foreach (PropertyItem pi in alPropertyItems)
        //                iSave.SetPropertyItem(pi);

        //            //Save the temp image over the original image
        //            iSave.Save(file, ifOriginal);

        //            return true;
        //        }
        //        catch (Exception)
        //        {
        //            // TODO: Exception logging
        //            return false;
        //        }
        //        finally
        //        {
        //            iSave.Dispose();
        //        }
        //    }

        //    /// <summary>
        //    /// Add a standard EXIF field to the image
        //    /// </summary>
        //    ///// <param name="image"></param>
        //    ///// <param name="field"></param>
        //    ///// <param name="fieldValue"></param>
        //    private static void WriteEXIFField(Image image, ExifField field, string fieldValue)
        //    {
        //        Encoding asciiEncoding = new ASCIIEncoding();
        //        System.Text.Encoder encoder = asciiEncoding.GetEncoder();
        //        char[] tagTextChars = fieldValue.ToCharArray();
        //        int byteCount = encoder.GetByteCount(tagTextChars, 0, tagTextChars.Length, true);
        //        byte[] tagTextBytes = new byte[byteCount];
        //        encoder.GetBytes(tagTextChars, 0, tagTextChars.Length, tagTextBytes, 0, true);

        //        if (image.PropertyItems != null && image.PropertyItems.Length > 0)
        //        {
        //            PropertyItem propertyItem = image.PropertyItems[0];
        //            propertyItem.Id = (int)field;
        //            propertyItem.Type = 2;  // ASCII
        //            propertyItem.Len = tagTextBytes.Length;
        //            propertyItem.Value = tagTextBytes;
        //            PropertyItem PropertyTagGpsLongitude = 2;
        //            image.SetPropertyItem(propertyItem);
        //        }
        //    }
        //}

        //public class EXIFInfo : Dictionary<EXIFBase.ExifField, string>
        //{
        //    /// <summary>
        //    /// Initializes a new instance of the EXIFInfo class.
        //    /// </summary>
        //    public EXIFInfo() : base()
        //    {
        //        // Default constructor
        //    }

        //    /// <summary>
        //    /// Adds an EXIFField with the specified property value into the EXIFInfo
        //    /// </summary>
        //    public new void Add(EXIFBase.ExifField key, string value)
        //    {
        //        if (string.IsNullOrEmpty(value))
        //            throw new ArgumentException("Value can not be empty");

        //        base.Add(key, value);
        //    }
        //}

        //public void DoIt(string fileName)
        //{
        //    EXIFInfo info = new EXIFInfo();

        //    /// Add Exif Info to be added/updated
        //    info.Add(EXIFBase.ExifField.EquipMake, "Nikon");
        //    info.Add(EXIFBase.ExifField.EquipModel, "SomeMake");

        //    /// Call the main function
        //    EXIFBase.ChangeImageExif(fileName, info);
        //}


    }
}
