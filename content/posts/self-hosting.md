---
title: Self-Hosting Applications on Raspberry Pi 5
date: 2024-08-17 00:00:00
tags:
  - Raspberry Pi
  - DIY Projects
  - Homelab
categories:
  - Infrastructure
  - Self-Hosting
keywords:
  - Raspberry Pi 5
  - Self-Hosting Applications
  - Home Server Setup
  - DIY Tech Projects
  - Raspberry Pi Projects
---

## Introduction

Self-hosting applications can be a rewarding experience, providing full control over your software environment and data. In this blog post, I'll share my journey of setting up a self-hosted environment using a Raspberry Pi 5, detailing the hardware, software, and techniques I use to maintain and monitor my system.

## Hardware Setup

### Raspberry Pi 5 Specifications

- **CPU:** Quad-core Cortex-A76 at 2.5GHz
- **RAM:** 8GB LPDDR4
- **Storage:** [1TB SSD](https://www.onlyssd.com/buy/western-digital-blue-sn570-1tb-m-2-nvme-internal-ssd-wds100t3b0c/) attached via [Pimoroni PCIe HAT](https://www.thingbits.net/products/nvme-base-pcie-extension-hat-for-raspberry-pi-5)
- **Power Supply:** [Official Raspberry Pi charger](https://robu.in/product/official-27w-usb-c-pd-power-supply-for-raspberry-pi-5-white/), with inverter power backup for up to a couple of hours
- **Network:** The Raspberry Pi is connected via LAN to a router with an FTTH connection from the ISP
- **Operating System:** Debian based Raspberry Pi OS Lite

## Software Setup

### Security and Access

I use Cloudflare Zero Trust for a secure web gateway. Each application is exposed on a different subdomain. Access to these applications is restricted via the Warp client, with Cloudflare also offering the ability to create API token-based access. Cloudflare provides extensive logging and monthly overviews of network usage.

![Setup overview](https://res.cloudinary.com/journalapp/image/upload/v1722788233/Zero_trust_isfzxx.jpg)

### Application Deployment

Applications are deployed as docker containers running in rootless mode. Containers are managed using [Dockge](https://github.com/louislam/dockge) via stack-oriented `docker compose.yaml` files.

![Dockge](https://res.cloudinary.com/journalapp/image/upload/v1723876451/WhatsApp_Image_2024-08-17_at_12.03.29_qtew15.jpg)

I also utilize [self-hosted GitHub Actions runners](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/adding-self-hosted-runners) to automate CI/CD for my own repositories.

### Favourite application

#### Immich

Immich is a self-hosted photo and video backup software that aims to replicate the convenience of Google Photos without the recurring costs. Immich has been a game-changer for me, especially during my recent trip to New York. With my iPhone storage filled up from taking hundreds of photos in a single day, Immich effortlessly allowed me to upload and organize my images, freeing up space almost instantly. It has all the features I expect like smart search, facial recognition, media transcoding and sharing along with intuitive interface and reliable performance made managing my photo storage a breeze, ensuring that I could keep capturing moments without any hassle.

![Immich](https://res.cloudinary.com/journalapp/image/upload/v1723879366/WhatsApp_Image_2024-08-17_at_12.52.28_grhdpd.jpg)

## Monitoring and Logging

For accessing Docker container logs, I use [Dozzle](https://dozzle.dev/), a simple and effective tool for debugging.

![Dozzle logs](https://res.cloudinary.com/journalapp/image/upload/v1722805619/docker_logs_jsykmj.jpg)
![Immich server logs](https://res.cloudinary.com/journalapp/image/upload/v1722806305/immich_logs_dxpmpa.jpg)

My monitoring stack includes Prometheus, Grafana, Alertmanager, and various exporters like Node Exporter, cAdvisor, PostgreSQL Exporter, Cloudflared, and services exposing OpenTelemetry metrics. These metrics are visualized using community-built Grafana dashboards.

- System monitoring
  ![system monitoring](https://res.cloudinary.com/journalapp/image/upload/v1722805618/pi_monitoring_adohqv.jpg)

- Database monitoring
  ![database monitoring](https://res.cloudinary.com/journalapp/image/upload/v1722805619/db_monitoring_j2qq7a.jpg)

- Gateway monitoring
  ![gateway monitoring](https://res.cloudinary.com/journalapp/image/upload/v1722805617/gateway_monitoring_ulu6qs.jpg)

- HTTP Server monitoring
  ![http server monitoring](https://res.cloudinary.com/journalapp/image/upload/v1722805619/open_telemetry_hdpfkj.jpg)

Critical alerts, such as high CPU usage or frequent 5xx errors, are sent to me via Slack through Alertmanager rules.

![high cpu use-age slack alert](https://res.cloudinary.com/journalapp/image/upload/v1722805618/slack_alerts_urkwwi.jpg)

## Challenges and Solutions

### Loose PCIe SSD HAT cable

I experienced SSH connectivity issues with random spikes in ping latency and sometimes even a 'Host is down' message when trying to ping my server. Making me think that it is network related issue. I tried both LAN and WiFi connections but still the problem persisted.

```
// ping stable for small duration
64 bytes from IP ADDR: icmp_seq=0 ttl=64 time=6.467 ms
64 bytes from IP ADDR: icmp_seq=1 ttl=64 time=2.575 ms
64 bytes from IP ADDR: icmp_seq=2 ttl=64 time=3.246 ms

// ping latency spikes after some duration
64 bytes from IP ADDR: icmp_seq=3 ttl=64 time=4992 ms
64 bytes from IP ADDR: icmp_seq=4 ttl=64 time=14331 ms
64 bytes from IP ADDR: icmp_seq=5 ttl=64 time=17592 ms

// followed by timeouts
Request timeout for icmp_seq 6
Request timeout for icmp_seq 7
Request timeout for icmp_seq 8
Request timeout for icmp_seq 9

// eventually connection disruption
ping: sendto: No route to host
Request timeout for icmp_seq 10
ping: sendto: Host is down
```

I also noticed that the SSD drive wasn't detected using the `lsblk` command, which led me to suspect a power-related issue. I thought my charger might not be supplying enough watts to handle the Pi 5, active cooler, and SSD. So, I purchased an official Raspberry Pi charger, but the problem persisted.

I had both SSD as well as SD Card mounted with OS installed on both of them. Boot priority was set to give preference to the SSD over the SD card. However, the system would sometimes boot from the SSD and other times from the SD card. Occasionally, the system would run from the SSD for a few hours, but then it would automatically restart and switch to the SD card. During travel, the PCIe cable connecting the Pi to the HAT became loose. Whenever this system reboots, Host becomes unavailable explaining why I faced network interruption. This also explains why the issue started occurring after moving to Bangalore. Debugging this was quite challenging.

![PCIe SSD HAT](https://res.cloudinary.com/journalapp/image/upload/v1723875442/image_mOqsf4Rznl_bk1eyo.png)

#### Solution:

```
Make sure all hardware connections are secured
```

### Rootless containers exit once the user session exits

Running Docker in rootless mode caused containers to stop after exiting the SSH session. I have a habit of not closing SSH connection opened in the terminal. Even if I close my laptop (just lid closed, not a shutdown), the SSH connection still remains open for small duration. After that duration user logs out and all containers exit making my applications unaccessible.

- If establish SSH connection, it would bring all containers back online.
- If keep my laptop open, containers kept running forever.

#### Solution:

```sh
loginctl enable-linger $UID
```

### Random Shutdowns

My Raspberry Pi experienced random shutdowns, which I linked to CPU IO spikes through monitoring.

![CPU IO spike](https://res.cloudinary.com/journalapp/image/upload/v1722805618/iowait_spike_qml7ax.jpg)

`dmesg` logs indicated that the NVMe SSD was entering power-saving mode, causing these shutdowns.

```
[  603.860958] nvme nvme0: controller is down; will reset: CSTS=0xffffffff, PCI_STATUS=0xffff
[  603.860967] nvme nvme0: Does your device have a faulty power saving mode enabled?
[  603.860969] nvme nvme0: Try "nvme_core.default_ps_max_latency_us=0 pcie_aspm=off" and report a bug
[  603.956075] nvme 0000:06:00.0: Unable to change power state from D3cold to D0, device inaccessible
[  603.956325] nvme nvme0: Removing after probe failure status: -19
[  603.970331] nvme0n1: detected capacity change from 1953525168 to 0
```

#### Solution:

1. Edit `/boot/firmware/cmdline.txt` to disable APST

```
sudo vim /boot/firmware/cmdline.txt
```

2. Add the following in the end

```
nvme_core.default_ps_max_latency_us=0
```

3. Reboot and see if you have disabled APST.

```
sudo nvme error-log /dev/nvme0
```

### Too many open files

Initially, Applications performed well, but over time, their performance degraded. The root cause was low default ulimits. I resolved this by increasing ulimits. I also added a [fan cooler](https://robu.in/product/official-raspberry-pi-5-active-cooler/) to maintain optimal temperatures to avoid thermal throttling.

Solution:

1. Edit `/etc/security/limits.conf` to set limits for users or groups

```
sudo nano /etc/security/limits.conf
```

2. Add the following lines to set the limits:

```
*    soft core            unlimited
*    hard core            unlimited
*    soft data            unlimited
*    hard data            unlimited
*    soft priority        0
*    hard priority        0
*    soft fsize           unlimited
*    hard fsize           unlimited
*    soft sigpending      63980
*    hard sigpending      63980
*    soft memlock         8192
*    hard memlock         8192
*    soft rss             unlimited
*    hard rss             unlimited
*    soft nofile          1048576
*    hard nofile          1048576
*    soft msgqueue        819200
*    hard msgqueue        819200
*    soft rtprio          0
*    hard rtprio          0
*    soft stack           8192
*    hard stack           8192
*    soft cpu             unlimited
*    hard cpu             unlimited
*    soft nproc           unlimited
*    hard nproc           unlimited
*    soft as              unlimited
*    hard as              unlimited
*    soft locks           unlimited
*    hard locks           unlimited
```

3. Reboot / Reload the Configuration

```
sudo reboot
```

4. Verify the Changes

```
ulimit -a
```

This will display the current limits applied to your session.

## Conclusion

Overall, I'm quite happy with my setup. It allows me to quickly self-host applications. However, I still need to devise a robust backup strategy. Currently, I manually back up data to a physical hard drive, which is not ideal. I also plan to explore scaling storage and compute, potentially setting up distributed systems with separate nodes for databases and applications to meet future needs.

## Final Thoughts

Self-hosting applications has been a valuable learning experience. It has equipped me with the skills and confidence to manage my infrastructure, troubleshoot issues, and optimize performance. I look forward to further enhancing my setup and sharing more insights with you all.

Happy self-hosting!
