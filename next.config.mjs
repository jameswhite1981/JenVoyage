/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Clickjacking protection — no page on this site is meant to be
          // embedded in someone else's iframe (least of all /admin/login).
          { key: "X-Frame-Options", value: "DENY" },
          // Stops browsers guessing a response's content-type from its
          // body and executing it as something else (e.g. a user-uploaded
          // file served as text/plain being sniffed and run as HTML/JS).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Don't leak the full URL (which can contain magic-link tokens
          // or enquiry ids in query strings) to third-party sites when a
          // user clicks an outbound link — only the origin is sent.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Lock down browser features this site never uses.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
