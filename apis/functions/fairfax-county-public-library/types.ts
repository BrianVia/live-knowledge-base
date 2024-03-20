/*
{
    "title": "Programming PHP : creating dynamic web pages",
    "dueDate": "2024-04-10T04:00:00.000Z",
    "renewalsLeft": "2",
    "callNumber": "005.276 PHP T 2020",
    "assignedBranch": "Chantilly Regional Library",
    "coverImageUrl": "https://secure.syndetics.com/index.aspx?isbn=9781492054139/MC.GIF&client=fcplpol&upc=&oclc=000001144745371",
    "linkDetails": "javascript:showModalBasic('https://fcplcat.fairfaxcounty.gov/patronaccount/components/ajaxiteminfo.aspx?RecID=2285896&VendorObjID=&VendorID=0')"
  }

*/
export interface FairfaxCountLibraryItemOut {
  title: string;
  dueDate: Date;
  renewalsLeft: number;
  callNumber: string;
  assignedBranch: string;
  coverImageUrl: string;
  linkDetails: string;
}
