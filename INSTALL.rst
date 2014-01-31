==============
 Installation
==============

If this documentation is unclear, please post questions to Omega Hymnal's github page and I will try to incorporate the answers here.


Requirements
============

Omega Hymnal should, in theory, run on any platform that can run Python; in practice, it's developed and tested on Linux (Arch and Debian), and not routinely tested on other platforms.

It should also, in theory, work with any reasonably standards-compliant browser.  In practice, it's tested against the Chromium web browser and sometimes Firefox.  There are some known bugs in Firefox.

Before you can run Omega Hymnal, you need to install the prerequisites, Python and Flask.

Python
------

Python 3.x preferred; 2.x may work, though you can probably expect bugs if your version is older than 2.6.

Please see http://www.python.org/getit/ for instructions on installing Python on your operating system.  Linux and OSX users should be aware that Python is probably already installed on your system; make sure it's a new enough version, though.

Flask
-----

Flask 0.1.0 or higher recommended.

Please see instructions at http://flask.pocoo.org/docs/installation/ for installing flask on your operating system.  Many Linux distributions also provide flask via the package management system, but make sure the version matches the recommendation above.  If it's older, you can try installing Flask using pip or easy_install.


Optional: SQLite3
-----------------

You don't need SQLite installed to run Omega Hymnal (Python comes with the necessary library support), but if you find you need to make manual changes to the database, it wouldn't hurt to have it handy.  See http://www.sqlite.org.


Setup
=====

- Download the latest Omega Hymnal source from https://github.com/alandmoore/omega-hymnal/archive/master.zip and extract it to a directory where you have read/write access (e.g. your home directory or Documents folder).  Alternately, if you have git installed and know how to use it, you can do::

    git clone http://github.com/alandmoore/omega-hymnal

- The user who will be running Omega Hymnal needs read/write access to the database file and the directory it's in.  If this isn't the case, edit the omegahymnal.conf file and point the database file location to somewhere where the user can read/write.

- Launch omegahymnal.py with Python.

- Open a web browser and point it to http://localhost:5000.  You'll see an error about the database file needing to be initialized, so just click "Initialize".

- You should now find yourself looking at an empty Omega Hymnal reference.  You can click "New Song" to create your first song entries, or go to Tools->Import to import .omegahymnal files.  Sample import files are in the "songs" subdirectory.


Advanced
--------

Running as a Server
~~~~~~~~~~~~~~~~~~~

There are many ways you can set up Omega Hymnal as a server, so that multiple devices on a LAN can access the same instance.  Note that it is not recommended to run this on a public server, as it hasn't been designed for that level of security.

The following demonstrates one possible setup on a server running Debian.  Run these commands as root::

    # Install prerequisites

    aptitude install python python-flask git

    # Create the user to run omegahymnal

    useradd -d /opt/omegahymnal -mr
    su omegahymnal
    cd /opt/omegahymnal

    # Download the software

    git clone http://github.com/alandmoore/omega-hymnal

    # Uncomment the appropriate line in omegahymnal.conf to enable remote access:

    sed -i 's/#HOST/HOST/' omega-hymnal/omegahymnal.conf

    # exit back to root
    
    exit

    # Add a line to /etc/rc.local to run the script at boot

    echo 'cd /opt/omegahymnal/omega-hymnal && python omegahymnal.py &' >> /etc/rc.local

    # Go ahead and run the command so you don't need to reboot to see if it worked:

    cd /opt/omegahymnal/omega-hymnal && python omegahymnal.py &

Running behind Apache
~~~~~~~~~~~~~~~~~~~~~

Like any Flask or WSGI application, you can run Omega Hymnal behind a web server like Apache or Nginx.  Check out http://flask.pocoo.org/docs/deploying/ for various options to deploy Flask applications like OH behind a server like this.  Warning:  this takes a bit of tweaking and server expertise.

Running with a Python virtual environment
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If your OS doesn't have the latest version of Flask easily available, you can set up a Python virtual environment and get the latest Flask using pip.  This is the recommended way to run Flask, but it requires a bit of extra setup and effort and may not be entirely necessary for Omega Hymnal, but if you're using (for example) a Linux like Debian or CentOS with conservative release cycles, the repository version of Flask may not be new enough.

You can learn more about Python virtual environments at http://www.virtualenv.org/en/latest/.

