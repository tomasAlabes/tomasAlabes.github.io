---
layout: post
title:  "Handling attackers in your web application"
description: "Techniques for handling attackers in your web application"
date:   2013-03-13 12:30:16
categories: web-development
tags: security, web
---

Anyone designing an application for which security is remotely important must assume that it will be directly targeted by dedicated and skilled attackers. A key function of the application’s security mechanisms is being able to handle and react to these attacks in a controlled way.

Handling Errors

However careful an application’s developers are when validating user input, it is virtually inevitable that some unanticipated errors will occur.
A key defense mechanism is for the application to handle unexpected errors gracefully, and either recover from them or present a suitable error message to the user.
In a production context, the application should never return any system-generated messages or other debug information in its responses.
Overly verbose error messages can greatly assist malicious users in furthering their attacks against the application. In some situations, an attacker can leverage defective error handling to retrieve sensitive information within the error messages themselves, providing a valuable channel for stealing data from the application.
Effective error handling is often integrated with the application’s logging mechanisms, which record as much debug information as possible about unanticipated errors.
Maintaining Audit Logs

Audit logs are valuable primarily when investigating intrusion attempts against an application.
Effective audit logs should enable the application’s owners to understand exactly what has taken place, which vulnerabilities (if any) were exploited, whether the attacker gained unauthorized access to data or performed any unauthorized actions, and, as far as possible, provide evidence of the intruder’s identity.
An effective approach is to store audit logs on an autonomous system that accepts only update messages from the main application. In some situations, logs may be flushed to write-once media to ensure their integrity in the event of a successful attack.
Alerting Administrators

Audit logs enable an application’s owners to retrospectively investigate intrusion attempts and, if possible, take legal action against the perpetrator. However, in many situations it is desirable to take much more immediate action, in real time, in response to attempted attacks.
In most situations, alerting mechanisms must balance the conflicting objectives of reporting each genuine attack reliably and of not generating so many alerts that these come to be ignored.
Anomalous events monitored by alerting mechanisms often include the following:
Usage anomalies, such as large numbers of requests being received from a single IP address or user, indicating a scripted attack 
Business anomalies, such as an unusual number of funds transfers being made to or from a single bank account 
Requests containing known attack strings
Requests where data that is hidden from ordinary users has been modified
In any security-critical application, the most effective way to implement real-time alerting is to integrate this tightly with the application’s input validation mechanisms and other controls.
Reacting to Attacks 

In addition to alerting administrators, many security-critical applications contain built-in mechanisms to react defensively to users who are identified as potentially malicious.
Some applications take automatic reactive measures to frustrate the activities of an attacker who is working systematically to discover any application defect.
Although these measures will not defeat the most patient and determined attacker, they will deter many more casual attackers and will buy additional time for administrators to monitor the situation and take more drastic action if desired.
Reacting to apparent attackers is not, of course, a substitute for fixing any vulnerabilities that exist within the application. But placing further obstacles in the way of an attacker is an effective defense-in-depth measure that reduces the likelihood that any residual vulnerabilities will be found and exploited.
Conclusion

These mechanisms often incorporate a mix of defensive and offensive measures designed to frustrate an attacker as much as possible and give the application’s owners appropriate notification and evidence of what has taken place. 

This have been partially extracted from a wonderful book about web applications security: The Web Application Hacker's Handbook: Finding and Exploiting Security Flaws. If you would like to dive deeper into any of this subjects I encourage you to buy it.

Have this mechanisms in mind and use them if you can.

Tomas Alabes