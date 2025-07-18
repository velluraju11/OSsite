"use client";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-border/40 py-6 bg-card">
      <div className="container mx-auto px-4 md:px-6 flex justify-center items-center">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} Ryha OS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
