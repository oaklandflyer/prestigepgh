# Pittsburgh Prestige Remodeling Website

This is the official website for **Pittsburgh Prestige Remodeling**, built as a clean, modern, one‑page portfolio and business site. It is designed for deployment on **GitHub Pages**.

## 🚀 Features
- Responsive, mobile‑friendly layout
- Hero section with call‑to‑action buttons
- Services grid (Kitchens, Bathrooms, Basements)
- Portfolio gallery with project placeholders
- About & Testimonials section
- Contact form (Netlify‑ready) + service area image
- SEO meta tags & JSON‑LD schema for local business
- Simple CSS styling with modern design

## 🛠️ Setup Instructions
1. Clone or download this repo.
   ```bash
   git clone https://github.com/<your-username>/pittsburgh-prestige-remodeling.git
   cd pittsburgh-prestige-remodeling
   ```

2. Commit the provided `index.html` to the repo root.
   ```bash
   git add index.html
   git commit -m "Initial commit: PPR website"
   git push origin main
   ```

3. Enable **GitHub Pages**:
   - Go to *Settings → Pages*.
   - Select *Deploy from a branch*, choose **main**, and set root (`/`).
   - Your site will be live at:
     `https://<your-username>.github.io/pittsburgh-prestige-remodeling/`

4. (Optional) Configure a custom domain:
   - Add a `CNAME` file with your domain (e.g. `pittsburghprestigeremodeling.com`).
   - Update DNS records as instructed in GitHub Pages settings.

## 📸 Customization
- Replace placeholder images in the **Portfolio** section with real project photos.
- Update company contact details in the **Contact** section.
- Adjust colors, fonts, or layout directly in the `<style>` block inside `index.html`.
- Swap testimonials and About text with client‑specific content.

## 📬 Contact Form
The contact form is pre‑configured for **Netlify Forms**. If deploying only with GitHub Pages, you can:
- Replace with a `mailto:` link, OR
- Connect with Formspree/Basin for handling submissions.

## 📄 License
This project is provided as a starter template for Pittsburgh Prestige Remodeling. Free for personal or commercial adaptation.
