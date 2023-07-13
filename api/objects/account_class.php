<?php

/*
 * 	This class file can be downloaded from Alex Web Develop "PHP Login and Authentication Tutorial":
 * 	
 * 	https://alexwebdevelop.com/user-authentication/
 * 	
 * 	You are free to use and share this script as you like.
 * 	If you want to share it, please leave this disclaimer inside.
 * 	
 * 	Subscribe to my free newsletter and get my exclusive PHP tips and learning advice:
 * 	
 * 	https://alexwebdevelop.com/
 * 	
*/


class Account {
	private $id;
	private $name;
    private $role;
    private $data_id;
	/* TRUE if the user is authenticated, FALSE otherwise */
	private $authenticated;
	
	public function __construct()
	{
		$this->id = NULL;
		$this->name = NULL;
		$this->role = NULL;
		$this->data_id = NULL;
		$this->authenticated = FALSE;
	}
	
	public function __destruct() { }
	
	public function getId(): ?int {
		return $this->id;
	}
	
	public function getName(): ?string {
		return $this->name;
	}

	public function getRole(): ?string {
		return $this->role;
	}
	
	public function getDataId(): ?string {
		return $this->data_id;
	}
	public function isAuthenticated(): bool {
		return $this->authenticated;
	}
	
	public function addAccount(string $name, string $passwd, string $role, $data_id, $connected): int {
		global $pdo;
		
		$name       = trim($name);
		$passwd     = trim($passwd);
		$role       = trim($role);
		$data_id    = trim($data_id);
		$connected  = trim($connected);

        if ($role === "superadmin") {
            $data_id = NULL;
        }
		
		if (!$this->isNameValid($name)) {
			throw new Exception('Der Benutzername muss aus mindestens 4 Buchstaben bestehen.');
		}
		
		if (!$this->isPasswdValid($passwd)) {
			throw new Exception('Das Passwort muss aus indestens 8 Buchstaben/ Zeichen bestehen.');
		}
		
		if (!is_null($this->getIdFromName($name, $data_id))) {
			throw new Exception('Der Benutzername ist bereits vergeben.');
		}
		
        $query;
        $value;
        if ($connected === "false") {
            $query = 'INSERT INTO datadienstplandb.users (username, password, role, data_id) VALUES (:name, :passwd, :role, :data_id)';
            $hash = password_hash($passwd, PASSWORD_DEFAULT);
            $values = array(':name' => $name, ':passwd' => $hash, ':role' => $role, 'data_id' => $data_id);
        } else {
            $query = 'INSERT INTO datadienstplandb.users (username, password, role, data_id, connected_person) VALUES (:name, :passwd, :role, :data_id, :connected)';
            $hash = password_hash($passwd, PASSWORD_DEFAULT);
            $values = array(':name' => $name, ':passwd' => $hash, ':role' => $role, ':data_id' => $data_id, ':connected' => $connected );
        }
		
		try {
			$res = $pdo->prepare($query);
			$res->execute($values);
		} catch (PDOException $e) {
		   throw new Exception('Database query error account_class.php');
		}
		
		return $pdo->lastInsertId();
	}
	
	public function deleteAccount(int $id, int $data_id, string $passwd) {
		global $pdo;
        $passwd = trim($passwd);
        $query = 'SELECT * FROM datadienstplandb.users WHERE (id = :user_id)';
        $values = array(':user_id' => $_SESSION["user_id"]);

        try {
            $res_u = $pdo->prepare($query);
            $res_u->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error account_class.php');
        }
        $row_u = $res_u->fetch(PDO::FETCH_ASSOC);
        if (is_array($row_u)) {
            if (!password_verify($passwd, $row_u['password'])) {
                return 'Dein Passwort ist ungültig.';
            }
        }
		
		if (!$this->isIdValid($id)) {
			throw new Exception('Invalid account ID');
		}
		
		$query = 'DELETE FROM datadienstplandb.users WHERE (id = :id)';
		$values = array(':id' => $id);
		
		try {
			$res = $pdo->prepare($query);
			$res->execute($values);
		} catch (PDOException $e) {
		   throw new Exception('Database query error account_class.php');
		}
		
		$query = 'DELETE FROM datadienstplandb.user_sessions WHERE (user_id = :id)';
		$values = array(':id' => $id);
		
		try {
			$res_s = $pdo->prepare($query);
			$res_s->execute($values);
		} catch (PDOException $e) {
		   throw new Exception('Database query error account_class.php');
		}
        return (int) $id;
	}
	
	public function editAccount(int $id, string $name, string $passwd, bool $enabled, int $data_id) {
		global $pdo;
		
		$name = trim($name);
		$passwd = trim($passwd);
		
		if (!$this->isIdValid($id)) {
			throw new Exception('Invalid account ID');
		}
		
		if (!$this->isNameValid($name)) {
			throw new Exception('Der Benutzername muss aus mindestens 4 Buchstaben bestehen.');
		}
		
		if (!$this->isPasswdValid($passwd)) {
			throw new Exception('Das Passwort muss aus indestens 8 Buchstaben/ Zeichen bestehen.');
		}
		
		$idFromName = $this->getIdFromName($name, $data_id);
		
		if (!is_null($idFromName) && ($idFromName != $id)) {
			throw new Exception('Der Benutzername wirdbereits genutzt.');
		}
		
		$query = 'UPDATE datadienstplandb.users SET username = :name, password = :passwd, enabled = :enabled WHERE id = :id';
		$hash = password_hash($passwd, PASSWORD_DEFAULT);
		$intEnabled = $enabled ? 1 : 0;
		$values = array(':name' => $name, ':passwd' => $hash, ':enabled' => $intEnabled, ':id' => $id);
		
		try {
			$res = $pdo->prepare($query);
			$res->execute($values);
		} catch (PDOException $e) {
		   throw new Exception('Database query error account_class.php');
		}
	}

	/* Login with username and password */
	public function login(string $name, string $passwd, $data_id): bool {
		global $pdo;	
		
		$name = trim($name);
		$passwd = trim($passwd);
		
		if (!$this->isNameValid($name)) {
			return FALSE;
		}
		
		if (!$this->isPasswdValid($passwd)) {
			return FALSE;
		}
		
        $query;
        $values = array();
        if ($data_id === "superadmin") {
            $query = 'SELECT * FROM datadienstplandb.users WHERE (username = :name) AND (enabled = 1) AND data_id IS NULL';
            $values = array(':name' => $name);
        } else {
            $query = 'SELECT * FROM datadienstplandb.users WHERE (username = :name) AND (enabled = 1) AND data_id = :data_id';
            $values = array(':name' => $name, ':data_id' => $data_id);
        }
		
		try {
			$res = $pdo->prepare($query);
			$res->execute($values);
		} catch (PDOException $e) {
		   throw new Exception('Database query error account_class.php');
		}
		
		$row = $res->fetch(PDO::FETCH_ASSOC);
		
		if (is_array($row)) {
			if (password_verify($passwd, $row['password'])) {
				/* Authentication succeeded. Set the class properties (id and name) */
				$this->id = intval($row['id'], 10);
				$this->name = $name;
				$this->role = $row['role'];
				$this->authenticated = TRUE;
				$this->data_id = $row['data_id'];
				/* Register the current Sessions on the database */
				$this->registerLoginSession();
				
				$_SESSION["data_id"]    = $row['data_id'];
				$_SESSION["user_id"]    = $row['id'];
				$_SESSION["user_role"]  = $row['role'];
                if ($row['role'] === "admin") {
                    $_SESSION["administration"] = 'editor';
                } else if ($row['role'] === "user") {
                    $_SESSION["connected_person"]  = $row['connected_person'];
                    $_SESSION["administration"] = 'visitor';
                } else {
                    $_SESSION["administration"] = 'visitor';
                }
                $this->closeOtherSessions();
				return TRUE;
			}
		}
		
		return FALSE;
	}
	
	/* A sanitization check for the account username */
	public function isNameValid(string $name): bool {
		$valid = TRUE;
		$len = mb_strlen($name);
		
		if ($len < 4) {
			$valid = FALSE;
		}
		
		return $valid;
	}
	
	/* A sanitization check for the account password */
	public function isPasswdValid(string $passwd): bool {
		$valid = TRUE;
		$len = mb_strlen($passwd);
		if ($len < 8) {
			$valid = FALSE;
		}
		
		return $valid;
	}
	
	/* A sanitization check for the account ID */
	public function isIdValid(int $id): bool {
		$valid = TRUE;
		if (($id < 1) || ($id > 1000000)) {
			$valid = FALSE;
		}
		
		return $valid;
	}
	
	/* Login using Sessions */
	public function sessionLogin(): bool {
		global $pdo;
		
		/* Check that the Session has been started */
		if (session_status() == PHP_SESSION_ACTIVE) {
			$query = 
			'SELECT * FROM datadienstplandb.user_sessions, datadienstplandb.users WHERE (user_sessions.session_id = :sid) ' . 
			'AND (user_sessions.login_time >= (NOW() - INTERVAL 7 DAY)) AND (user_sessions.user_id = users.id) ' . 
			'AND (users.enabled = 1)';
			$values = array(':sid' => session_id());
			
			try {
				$res = $pdo->prepare($query);
				$res->execute($values);
			} catch (PDOException $e) {
			   throw new Exception('Database query error account_class.php');
			}
			
			$row = $res->fetch(PDO::FETCH_ASSOC);
			
			if (is_array($row)) {
				/* Authentication succeeded. Set the class properties (id and name) and return TRUE*/
				$this->id = intval($row['user_id'], 10);
				$this->name = $row['username'];
				$this->authenticated = TRUE;
				$_SESSION["data_id"]    = $row['data_id'];
				$_SESSION["user_id"]    = $row['id'];
				$_SESSION["user_role"]  = $row['role'];
                if ($row['role'] === "admin") {
                    $_SESSION["administration"] = 'editor';
                } else if ($row['role'] === "user") {
                    $_SESSION["connected_person"]  = $row['connected_person'];
                    $_SESSION["administration"] = 'visitor';
                } else {
                    $_SESSION["administration"] = 'visitor';
                }
				
				return TRUE;
			}
		}
		
		return FALSE;
	}
	
	/* Logout the current user */
	public function logout() {
		global $pdo;
		
		/* If there is no logged in user, do nothing */
		/*if (is_null($this->id))
		{
			return;
        }*/
		
		/* Reset the account-related properties */
		$this->id = NULL;
		$this->name = NULL;
		$this->authenticated = FALSE;
		
		/* If there is an open Session, remove it from the user_sessions table */
		if (session_status() == PHP_SESSION_ACTIVE) {
			$query = 'DELETE FROM datadienstplandb.user_sessions WHERE (user_id = :user_id)';
			$values = array(':user_id' => $_SESSION["user_id"]);
			
			try {
				$res = $pdo->prepare($query);
				$res->execute($values);
			} catch (PDOException $e) {
			   throw new Exception('Database query error account_class.php');
			}
            echo json_encode(array("message" => "Logout sucess."));
		}
	}
	
	/* Close all account Sessions except for the current one (aka: "logout from other devices") */
	public function closeOtherSessions() {
		global $pdo;
		
		/* If there is no logged in user, do nothing */
		if (is_null($this->id)) {
			return;
		}
		
		/* Check that a Session has been started */
		if (session_status() == PHP_SESSION_ACTIVE) {
			$query = 'DELETE FROM datadienstplandb.user_sessions WHERE session_id != :sid AND user_id = :id';
			$values = array(':sid' => session_id(), ':id' => $this->id);
			
			try {
				$res = $pdo->prepare($query);
				$res->execute($values);
			} catch (PDOException $e) {
			   throw new Exception('Database query error account_class.php');
			}
		}
	}
	
	/* Returns the account id having $name as name, or NULL if it's not found */
	public function getIdFromName(string $name, $data_id): ?int {
		global $pdo;
		if (!$this->isNameValid($name)) {
			throw new Exception('Der Benutzername muss aus mindestens 4 Buchstaben bestehen.');
		}
		
		$id = NULL;
		
		$query = 'SELECT id FROM datadienstplandb.users WHERE username = :name AND data_id = :data_id';
        $values = array(':name' => $name, ':data_id' => $data_id);
		
		try {
			$res = $pdo->prepare($query);
			$res->execute($values);
		} catch (PDOException $e) {
		   throw new Exception('Database query error account_class.php');
		}
		
		$row = $res->fetch(PDO::FETCH_ASSOC);
		
		if (is_array($row)) {
			$id = intval($row['id'], 10);
		}
		
		return $id;
	}
	public function getAll() {
        global $pdo;
        $query = "SELECT * FROM datadienstplandb.users";
        $values = array();
        
        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
           throw new Exception('Database query error account_class.php');
        }
        $users=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            $users_item=array(
                "id"        => (int)$row["id"],
                "name"      => (string)$row["username"],
                "role"      => (string)$row["role"],
                "data_id"   => (int)$row["data_id"],
                "enabled"   => (int)$row["enabled"],
                "created_at" => (string)$row["created_at"]
            );
            array_push($users, $users_item);
        }
        return $users;
    }
	public function getAllDefaultData(int $data_id) {
        global $pdo;
        $query = 'SELECT * FROM datadienstplandb.users WHERE data_id = :data_id AND role != "superadmin"';
        $values = array(':data_id' => $data_id);
        
        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
           throw new Exception('Database query error account_class.php');
        }
        $users=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            $connected = $row["connected_person"];
            if (is_numeric($connected)) {
                $connected = (int)$connected;
            }
            $users_item=array(
                "id"        => (int)$row["id"],
                "name"      => (string)$row["username"],
                "role"      => (string)$row["role"],
                "enabled"   => (int)$row["enabled"],
                "created_at" => (string)$row["created_at"],
                "connected_person" => $connected
            );
            array_push($users, $users_item);
        }
        return $users;
    }
	public function updatePassword(int $data_id, int $id, string $password ) {
        global $pdo;
		$data_id    = trim($data_id);
		$id         = trim($id);
		$passwd     = trim($password);

		if (!$this->isPasswdValid($passwd)) {
			throw new Exception('Das Passwort muss aus indestens 8 Buchstaben/ Zeichen bestehen.');
		}
		
		$query = 'UPDATE datadienstplandb.users SET password = :passwd WHERE id = :id';
		$hash = password_hash($passwd, PASSWORD_DEFAULT);
		$intEnabled = $enabled ? 1 : 0;
		$values = array(':passwd' => $hash, ':id' => $id);
		
		try {
			$res = $pdo->prepare($query);
			$res->execute($values);
		} catch (PDOException $e) {
		   throw new Exception('Database query error account_class.php');
		}
        return (int)$id;
    }
	public function updateName(int $data_id, int $id, string $name ) {
        global $pdo;
		$data_id    = trim($data_id);
		$id         = trim($id);
		$name       = trim($name);

		if (!$this->isNameValid($name)) {
			throw new Exception('Der Benutzername muss aus mindestens 4 Buchstaben bestehen.');
		}
		$idFromName = $this->getIdFromName($name, $data_id);
		
		if (!is_null($idFromName) && ($idFromName != $id)) {
			throw new Exception('Der Benutzername wirdbereits genutzt.');
		}
		
		$query = 'UPDATE datadienstplandb.users SET username = :name WHERE id = :id';
		$values = array(':name' => $name, ':id' => $id);
		
		try {
			$res = $pdo->prepare($query);
			$res->execute($values);
		} catch (PDOException $e) {
		   throw new Exception('Database query error account_class.php');
		}
        return $name;
    }
	
	
	/* Private class methods */
	
	/* Saves the current Session ID with the account ID */
	private function registerLoginSession() {
		global $pdo;
		
		/* Check that a Session has been started */
		if (session_status() == PHP_SESSION_ACTIVE) {
			$query = 'REPLACE INTO datadienstplandb.user_sessions (session_id, user_id, login_time) VALUES (:sid, :accountId, NOW())';
			$values = array(':sid' => session_id(), ':accountId' => $this->id);
			
			try {
				$res = $pdo->prepare($query);
				$res->execute($values);
			} catch (PDOException $e) {
			   throw new Exception('Database query error account_class.php');
			}
		}
	}
}
