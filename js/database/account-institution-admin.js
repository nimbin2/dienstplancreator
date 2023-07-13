dbGet_users = async () => {
    let response = await fetch("/api/account/getAllDefaultData.php", {
        method: "POST",
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    })  
    return await response.json()
}
