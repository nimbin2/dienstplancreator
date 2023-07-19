# Dienstplancreator

DIese Seite ist zum Erstellen und Speichern von Dienstplänen.

## Voraussetzungen

- PHP
- MySQL

## Anleitung

1. Repository klonen:
  `git clone git@github.com:nimbin2/dienstplancreator.git`


2. MySQL Benutzer und Datenbank erstellen. Derzeit sollte der Name "datadienstplandb" beibehalten werden oder er muss in allen Dateien im Ordner "api" geändert werden (z.B. mit `sed -i "s/datadienstplandb/NEUERNAME/g" api/*/*`):

```mysql -u root -p
CREATE USER `USERNAME`@'localhost' IDENTIFIED BY 'PASSWORD';
CREATE DATABASE `datadienstplandb`;
GRANT ALL PRIVILEGES ON `datadienstplandb`.* TO 'USERNAME'@'localhost';
FLUSH PRIVILEGES;
```

2.1 MySQL Username und Password in `api/config/db_inc.php` einfügen:

    $user = 'USERNAME';
    $passwd = 'PASSWORD';

3. Apache starten:

```
<VirtualHost *:80>
    ServerAdmin mail@me.de
    DocumentRoot "PATHTODIR"
    ServerName dienstplan-creator.de
    ServerAlias www.dienstplan-creator.de
    ErrorLog "PATHTOERRORLOG"
    CustomLog "PATHTOACCESSLOG" combined

    <Directory "PATHTODIR">
        Options Indexes MultiViews FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

4. Domain DNS einrichten und mit dem Server verknüpfen:

   - Typ: A
   - Name: @
   - Daten: SERVERIP

5. Certbot für HTTPS:

```
sudo certbot --apache -d mydomain.de
```

6. In der `index.php` den Abschnitt zum Erstellen eines Accounts uncommenten, sodass der erste Nutzer erstellt wird,- ändere "admin" zu "superadmin". Nach erstem Laden der Seite den Abschnitt wieder kommentieren:
```
# Insert a new account (execute twice to test the "already existing" account error)
```

7. Fehler finden

8. Einen Fehler korrigieren, der eine MySQL-Injection ermöglicht (irgendwo in den API-Files)

9. Feststellen, dass es mein erstes größeres PHP Projekt ist und somit aufräumen

10. Feststellen, dass das gesamte Projekt einmal um und nicht neu geschrieben wurde und somit die JS-Files aufräumen (z.B. ungenutze Funktionen löschen, - ich glaube es sind um die 30 - [hier](https://scripts.christianimmanuel.de/bash-scripts/Useful/find_js_functions.sh) ist ein Skript, das dabei helfen kann)

