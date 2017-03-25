

Possible adjustment(s) to make this work on your machine:
- in server/model.php
	go to dbConnect() and make sure the DBNAME and DBPASS are correct for YOUR local database

//////////////////////////////////////////////////////////////////////////////
// IMPORTANT - DO NOT REMOVE/MOVE FROM TOP OF FILE
///////////////////////////////////////////////////////////////////////////////////////
- Do Not Touch JS or PHP
	- If you want something changed, or want a feature (ie active navigation links), then ASK and it will be done
- Use the environment in the DropBox
	- FrontEnd_working/ should have the most up-to date STABLE web application
	- If you have an update, name it: FrontEnd_<InsertDate> 
		- If we have conflicting folder names, use FrontEnd_E_<InsertDate>, FrontEnd_S_<InsertDate>
		- Once we have come a mutual agreement that styling and functionality are not broken, we will change updated FrontEnd_working/
	- DO NOT DELETE a directory, unless we agree it is out of date
- To avoid conflicts and breaking of styling & functionality, Emma will let Seema know which 
	pages are ready for styling
- Emma will not touch CSS, unless it breaks functionality

/*****************************************************************************************/

As of MARCH 25, 2017

Updated functionality for Admin Monitor Studies (note that this page is still incomplete, as creating a post is broken)
New functionality for Admin Monitor Users
New functionality for logout (just for Admin side)
Graphs on User Statistics and Admin Monitor Studies should be responsive now
Functionality for extract Data on Monitor Users 

The following pages are available to work on (most have full functionality)
- Admin Home
- Admin Profile Page
- Admin User Accounts (note, I am going to update the table to include 3 more columns, but that shouldn't affect styling)
- Admin Monitor Users
- Admin Monitor Studies (me fixing the create post shouldn't affect HTML)
- Admin Create Studies
- Admin Manage Studies 

Slight change in file structure:
Any non-ctr JS file is now in vendor/ this is to keep our work separate from what we downloaded
Unnecessary files should now be removed

/*****************************************************************************************/
As of MARCH 19, 2017
/////////////////////////////////////////////////////////////////////////////
// IMPORTANT
///////////////////////////////////////////////////////////////////////////////////////

- Please do not import Bootstrap.theme files, they break styling and are not needed for our system at all. 

- User stats: 
	1. The JS needs some kindof window resize function, if the below block is added to the js file theres two popup warnings because the DataTables can't be reinitialized. However, it works for resizing the charts... so this is something to try and consider.  
			$(window).resize(function(){
			  loadUserStatisticsView();
			});

	2. Please check TO DO comments I added: as there are things to add as well as delete which I did not want to do without your approval, just incase. Howver, If you follow the todo advice, the styling will all be fixed... Please do that first. 

- Progress	
	1. The pages I feel are complete on my end are:
		- index.html
		- user-template.html
		- user-home-view.html
		- user-input-data-view.html
		- user-statistics-view.html

	2. The pages in progress are: 
		- user-profile-view.html
		- user-community-posts-view.html

	3. The pages to do next: 
		- admin pages

- Sidebar
	1. Sidebar doesnt highlight the right page view tab anymore. JS issue, once its fixed I'll peak at styling that.
	2. sidebar background has issues with size which i can focus on later.

- Note: I did not change ANYTHING in any JS file except what i mentioned there, and I commented my additions out. So, the file's functionality are exactly as received. However, HTML pages were changes significantly without the alteration of any ID tags, and no changes to functionality. 
- Note: Template.css has been altered quite abit. Works identically as before, except added styles and removed redundencies. 

/*****************************************************************************************/


As of MARCH 10
///////////////////////////////////////////////////////////////////////////////////////
// UPDATE THE BELOW as work progresses							
///////////////////////////////////////////////////////////////////////////////////////
Pages ready for styling:
	- User Pages **note: functionality is not complete, but styling can start

Pages in progress (Functionality):
	- Admin Pages

Please Update this README.txt 




