# CyberLab Essentials – Virtual Cybersecurity Practice Environment

CyberLab Essentials is an interactive, modern educational web application designed to help students build and utilize a safe, isolated virtual cybersecurity laboratory. It teaches fundamental networking concepts, Linux terminal administration, security tools, and defensive analysis workflows through guided practice labs and documentation.

## Objective & Ethical Guidelines

This application is designed **strictly for defensive education and authorized testing** within virtual environments (e.g., VirtualBox, VMware). It does not contain any capabilities or scripts that automate attacks on external networks or systems. All users must adhere to ethical cybersecurity standards and target only their local, isolated sandboxed systems.

---

## Technical Features

1. **Dashboard:** Interactive statistics, visual syllabus completion rings, recent journal logs, and quick navigation modules.
2. **Interactive Topology:** Interactive SVG network mapping illustrating interface bounds (NAT vs. Host-Only interfaces) and vulnerable target isolation requirements.
3. **Step-by-Step Setup:** Configurable accordions for hypervisors, Kali, Windows VM, Metasploitable, isolated networks, and system snapshots. Checkpoints automatically synchronize to database storage.
4. **Linux Shell Simulator:** Interactive Unix commands catalog (permissions, processes, package downloads, interfaces) running inside a pseudo-CRT green terminal console.
5. **Networking Hub:** Subnet, DHCP, DNS, and routing documentation, integrated with an interactive Subnet CIDR Calculator.
6. **Command Generator:** Interactive Nmap flag assembler that constructs scanning arguments on the fly and explains security flags.
7. **Guided Labs & Journal:** Practical vulnerability verification forms that reward correct answers and auto-draft lab logs. Students can attach screenshot evidence and export files to PDF.

---

## Technology Stack

- **Backend:** Python (Flask)
- **Database:** SQLite3
- **Frontend:** Vanilla HTML5, CSS3 (Modern Glassmorphic Dark Theme), and JavaScript (ES6)

---

## Installation & Setup

Follow these steps to run the application locally on your host computer:

### 1. Clone or Extract the Project
Ensure the project structure is intact in your working folder:
```
/
├── app.py
├── database.py
├── schema.sql
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js
│       ├── shell.js
│       └── lab.js
└── templates/
    ├── base.html
    ├── dashboard.html
    ...
```

### 2. Install Dependencies
Make sure you have Python 3 installed. Install Flask using `pip`:
```bash
pip install Flask
```

### 3. Start the Server
Run the Flask server:
```bash
python app.py
```
By default, the server runs on `http://127.0.0.1:5000/`.

### 4. Open in Web Browser
Open your preferred browser and navigate to:
[http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## Virtual Lab Architecture Overview

For a safe practice lab configuration, configure virtual machine adapters in VirtualBox as follows:

| Virtual Machine | Network Adapter 1 | Network Adapter 2 |
| :--- | :--- | :--- |
| **Kali Linux** (Attacker) | NAT (Allows internet packages) | Host-Only (192.168.56.x) |
| **Windows VM** (Target) | NAT (Allows OS updates) | Host-Only (192.168.56.x) |
| **Metasploitable** (Vulnerable Target) | Host-Only (192.168.56.x) | None (Disabled for isolation) |

*Always shut down targets and take base snapshots before executing port scans or configuring firewall policies.*
