// Linux Command simulator engine

const commandDatabase = {
    ls: {
        syntax: "ls -la",
        prompt: "kali@sec-lab:~$ ",
        cmd: "ls -la",
        output: "total 28\ndrwxr-xr-x  3 kali kali 4096 Aug  7 12:00 .\ndrwxr-xr-x 19 kali kali 4096 Aug  7 11:30 ..\n-rw-r--r--  1 kali kali  220 Aug  7 11:00 .bash_logout\n-rw-r--r--  1 kali kali 3515 Aug  7 11:00 .bashrc\n-rw-r--r--  1 kali kali  807 Aug  7 11:00 .profile\ndrwxr-xr-x  2 kali kali 4096 Aug  7 12:00 Desktop\n-rwxr-xr-x  1 kali kali  142 Aug  7 12:01 backup.sh"
    },
    pwd: {
        syntax: "pwd",
        prompt: "kali@sec-lab:~/Desktop$ ",
        cmd: "pwd",
        output: "/home/kali/Desktop"
    },
    cat: {
        syntax: "cat /etc/passwd",
        prompt: "kali@sec-lab:~$ ",
        cmd: "cat /etc/passwd",
        output: "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\nkali:x:1000:1000:Kali Linux,,,:/home/kali:/bin/bash\nanalyst:x:1001:1001:Security Analyst,,,:/home/analyst:/bin/bash"
    },
    mkdir: {
        syntax: "mkdir -p /tmp/cyber_lab",
        prompt: "kali@sec-lab:~$ ",
        cmd: "mkdir -p /tmp/cyber_lab",
        output: "(Command executed successfully - directory created)"
    },
    whoami: {
        syntax: "whoami",
        prompt: "kali@sec-lab:~$ ",
        cmd: "whoami",
        output: "kali"
    },
    id: {
        syntax: "id",
        prompt: "kali@sec-lab:~$ ",
        cmd: "id",
        output: "uid=1000(kali) gid=1000(kali) groups=1000(kali),27(sudo),44(video),100(users)"
    },
    useradd: {
        syntax: "sudo useradd -m analyst",
        prompt: "kali@sec-lab:~$ ",
        cmd: "sudo useradd -m analyst",
        output: "[sudo] password for kali: *********\n(Account 'analyst' successfully created. User home directory /home/analyst set up)"
    },
    chmod: {
        syntax: "chmod +x backup.sh",
        prompt: "kali@sec-lab:~$ ",
        cmd: "chmod +x backup.sh",
        output: "(Permissions changed successfully. File is now runnable by current owner)"
    },
    chown: {
        syntax: "sudo chown root:root file.txt",
        prompt: "kali@sec-lab:~$ ",
        cmd: "sudo chown root:root file.txt",
        output: "[sudo] password for kali: *********\n(File ownership set to root:root)"
    },
    ps: {
        syntax: "ps aux | grep apache",
        prompt: "kali@sec-lab:~$ ",
        cmd: "ps aux | grep apache",
        output: "root      1204  0.0  1.2  24520  6142 ?        Ss   11:02   0:00 /usr/sbin/apache2 -k start\nwww-data  1208  0.0  0.8  24840  4110 ?        S    11:02   0:00 /usr/sbin/apache2 -k start\nwww-data  1209  0.0  0.8  24840  4110 ?        S    11:02   0:00 /usr/sbin/apache2 -k start\nkali      2541  0.0  0.1   6124   892 pts/0    S+   12:15   0:00 grep --color=auto apache"
    },
    kill: {
        syntax: "sudo kill -9 1402",
        prompt: "kali@sec-lab:~$ ",
        cmd: "sudo kill -9 1402",
        output: "[sudo] password for kali: *********\n[1]+  Killed                  /usr/sbin/apache2"
    },
    ipa: {
        syntax: "ip a",
        prompt: "kali@sec-lab:~$ ",
        cmd: "ip a",
        output: "1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000\n    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00\n    inet 127.0.0.1/8 scope host lo\n       valid_lft forever preferred_lft forever\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000\n    link/ether 08:00:27:85:2b:ff brd ff:ff:ff:ff:ff:ff\n    inet 10.0.2.15/24 brd 10.0.2.255 scope global dynamic eth0\n       valid_lft 86120sec preferred_lft 86120sec\n3: eth1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000\n    link/ether 08:00:27:ba:38:12 brd ff:ff:ff:ff:ff:ff\n    inet 192.168.56.101/24 brd 192.168.56.255 scope global dynamic eth1\n       valid_lft 86120sec preferred_lft 86120sec"
    },
    ping: {
        syntax: "ping -c 3 192.168.56.103",
        prompt: "kali@sec-lab:~$ ",
        cmd: "ping -c 3 192.168.56.103",
        output: "PING 192.168.56.103 (192.168.56.103) 56(84) bytes of data.\n64 bytes from 192.168.56.103: icmp_seq=1 ttl=64 time=0.452 ms\n64 bytes from 192.168.56.103: icmp_seq=2 ttl=64 time=0.389 ms\n64 bytes from 192.168.56.103: icmp_seq=3 ttl=64 time=0.412 ms\n\n--- 192.168.56.103 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2043ms\nrtt min/avg/max/mdev = 0.389/0.417/0.452/0.025 ms"
    },
    ss: {
        syntax: "ss -antp",
        prompt: "kali@sec-lab:~$ ",
        cmd: "ss -antp",
        output: "State      Recv-Q Send-Q Local Address:Port               Peer Address:Port\nLISTEN     0      128          0.0.0.0:22                     0.0.0.0:*\nLISTEN     0      80         127.0.0.1:3306                   0.0.0.0:*\nESTAB      0      0     192.168.56.101:22                192.168.56.1:58431"
    },
    aptupdate: {
        syntax: "sudo apt update",
        prompt: "kali@sec-lab:~$ ",
        cmd: "sudo apt update",
        output: "Get:1 http://http.kali.org/kali kali-rolling InRelease [41.2 kB]\nGet:2 http://http.kali.org/kali kali-rolling/main amd64 Packages [18.9 MB]\nFetched 18.9 MB in 4s (4725 kB/s)\nReading package lists... Done\nBuilding dependency tree... Done\nAll packages are up to date."
    },
    aptinstall: {
        syntax: "sudo apt install nmap -y",
        prompt: "kali@sec-lab:~$ ",
        cmd: "sudo apt install nmap -y",
        output: "Reading package lists... Done\nBuilding dependency tree... Done\nEvaluating dependencies...\nnmap is already the newest version (7.93+dfsg1-1).\n0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded."
    }
};

let selectedCommandKey = 'ls';
let isRunning = false;

document.addEventListener('DOMContentLoaded', () => {
    const cliCards = document.querySelectorAll('.cli-card');
    const runBtn = document.getElementById('run-btn');
    const syntaxDisplay = document.getElementById('syntax-display');
    
    // Default load
    loadCommand('ls');

    cliCards.forEach(card => {
        card.addEventListener('click', () => {
            if (isRunning) return;
            
            cliCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const key = card.getAttribute('data-cmd-id');
            loadCommand(key);
        });
    });

    runBtn.addEventListener('click', () => {
        if (isRunning) return;
        executeCommandSim();
    });
});

function loadCommand(key) {
    selectedCommandKey = key;
    const item = commandDatabase[key];
    if (item) {
        document.getElementById('syntax-display').textContent = item.syntax;
        document.getElementById('term-prompt').textContent = item.prompt;
        document.getElementById('term-input').textContent = '';
    }
}

function executeCommandSim() {
    isRunning = true;
    const runBtn = document.getElementById('run-btn');
    runBtn.disabled = true;
    
    const dbItem = commandDatabase[selectedCommandKey];
    const termInput = document.getElementById('term-input');
    const terminalHistory = document.getElementById('terminal-history');
    const consoleBody = document.getElementById('console-body');
    
    const commandText = dbItem.cmd;
    let charIndex = 0;
    
    // Typing animation
    const typingInterval = setInterval(() => {
        if (charIndex < commandText.length) {
            termInput.textContent += commandText.charAt(charIndex);
            charIndex++;
            consoleBody.scrollTop = consoleBody.scrollHeight;
        } else {
            clearInterval(typingInterval);
            
            // Execute simulator output after a brief pause
            setTimeout(() => {
                // Archive current command line in history
                const cmdLine = document.createElement('div');
                cmdLine.innerHTML = `<span class="terminal-prompt">${dbItem.prompt}</span><span class="terminal-input">${commandText}</span>`;
                terminalHistory.appendChild(cmdLine);
                
                // Add simulated output
                const outputLine = document.createElement('pre');
                outputLine.className = 'terminal-output';
                outputLine.textContent = dbItem.output;
                terminalHistory.appendChild(outputLine);
                
                // Reset input bar
                termInput.textContent = '';
                
                // Scroll down
                consoleBody.scrollTop = consoleBody.scrollHeight;
                
                // Re-enable run buttons
                isRunning = false;
                runBtn.disabled = false;
                
                // Auto check checkpoint on command run if exists
                autoCheckCategory(selectedCommandKey);
            }, 600);
        }
    }, 45);
}

function autoCheckCategory(key) {
    // Auto check the checkbox associated with matching key category
    let category = null;
    if (['ls', 'pwd', 'cat', 'mkdir'].includes(key)) category = 'linux_file_mgmt';
    else if (['whoami', 'id', 'useradd'].includes(key)) category = 'linux_user_mgmt';
    else if (['chmod', 'chown'].includes(key)) category = 'linux_perms';
    else if (['ps', 'kill'].includes(key)) category = 'linux_proc_mgmt';
    else if (['ipa', 'ping', 'ss'].includes(key)) category = 'linux_network_cmd';
    else if (['aptupdate', 'aptinstall'].includes(key)) category = 'linux_pkg_mgmt';
    
    if (category) {
        let chk = null;
        if(category === 'linux_file_mgmt') chk = document.getElementById('check-linux-file');
        if(category === 'linux_user_mgmt') chk = document.getElementById('check-linux-user');
        if(category === 'linux_perms') chk = document.getElementById('check-linux-perms');
        if(category === 'linux_proc_mgmt') chk = document.getElementById('check-linux-proc');
        if(category === 'linux_network_cmd') chk = document.getElementById('check-linux-net');
        if(category === 'linux_pkg_mgmt') chk = document.getElementById('check-linux-pkg');
        
        if (chk && !chk.checked) {
            chk.checked = true;
            toggleProgressItem(category, true);
        }
    }
}
