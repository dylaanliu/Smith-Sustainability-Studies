<?php

	// returns a DB connection handle. Otherwise returns null.
	function dbConnect() {
		// this will avoid mysql_connect() deprecation error.
		error_reporting( ~E_DEPRECATED & ~E_NOTICE );
	 
		define('DBHOST', '127.0.0.1');
		define('DBUSER', 'root');
		define('DBPASS', 'devcpp');
		define('DBNAME', 'cisc498');
	 
		$conn = mysqli_connect(DBHOST,DBUSER,DBPASS);
		if ( !$conn ) {
			die("Connection failed!!!");
		}
		$dbcon = mysqli_select_db($conn, DBNAME); 
		if ( !$dbcon ) {
			die("Database Connection failed!!!");
		}
		return $conn;
	}
?>