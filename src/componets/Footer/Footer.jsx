import React from "react";
import styles from "./styles.module.scss";

function Footer2() {
  return (
    <div className="bg-black p-2">
      <footer className={styles.footer}>
        <div className={styles.containerFooter}>
          <div className={styles.icons}></div>

          <ul className={styles.details}>
            <li>FAQ</li>
            <li>Help Center</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Contact Us</li>
            <li>Careers</li>
            <li>Cookie Preferences</li>
            <li>Legal Information</li>
            <li>Account</li>
            <li>Ways to Watch</li>
            <li>About Us</li>
            <li>iOS App</li>
            <li>Android App</li>
          </ul>

          <div className={styles.security}>
            <div>English</div>
            <span>© {new Date().getFullYear()} MovieFlix. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer2;
