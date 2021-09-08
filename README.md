<h2 align="center">TEWT TOOL (Proto)</h2>

<h3>SETUP</h3>

When first setting up the application, in the command line window go to the äpp" directory.
Then type "npm install" and wait for the required node_modules to be downloaded

<h3>RUN</h3>

RUN FROM TERMINAL
To run just the web server part of the application, change to the äpp" directory and type:
```sh
npm run bgServer
```

To run as an electron application (which includes a sys tray icon and access to a Electron Window GUI), change
to the "app" directory and type in:
```sh
 npm start
 ```

 <h3>BUILD</h3>

 To build the software use one of the below methods.
 To create a windows installer from the built files, you will need to have <a href="https://jrsoftware.org/isinfo.php">Inno Setup</a>.
 <ol>
 <li>Windows:
 ```sh
 npm run buildwin
 ```
 </li>
<li>MacOS:
 ```sh
 npm run buildmac
 ```
</li>
<li>Linux: (requires wsl installed on system)
 ```sh
 npm run buildlinux
 npm run deb64_wsl
 ```
</li>