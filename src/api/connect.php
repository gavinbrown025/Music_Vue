<?php

//! https://connect.deezer.com/oauth/auth.php?app_id=465462&redirect_uri=http://localhost:8080/&perms=basic_access,email

$app_id     = "465462";
$app_secret = "dcf2733b16fb91b394b7b0557f249edc";
$my_url     = "https://localhost:8080/";

session_start();
$code = 'fr9ae3345642827c8a9eb627839f8c4c';

if(empty($code)){
	$_SESSION['state'] = md5(uniqid(rand(), TRUE)); //CSRF protection

	$dialog_url = "https://connect.deezer.com/oauth/auth.php?app_id=".$app_id
		."&redirect_uri=".urlencode($my_url)."&perms=email,offline_access"
		."&state=". $_SESSION['state'];

	header("Location: ".$dialog_url);
	exit;

	}

if($_REQUEST['state'] == $_SESSION['state']) {
	$token_url = "https://connect.deezer.com/oauth/access_token.php?app_id="
	.$app_id."&secret="
	.$app_secret."&code=".$code;

	$response  = file_get_contents($token_url);
	$params    = null;
	parse_str($response, $params);
	$api_url   = "https://api.deezer.com/user/me?access_token="
			.$params['access_token'];

	$user = json_decode(file_get_contents($api_url));
	echo("Hello " . $user->name);
}else{
	echo("The state does not match. You may be a victim of CSRF.");
}


