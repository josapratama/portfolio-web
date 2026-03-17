import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Send,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Globe,
  Instagram,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { publicAPI } from "@/api/public";
import { useLanguageStore } from "@/store/languageStore";
import { getText } from "@/types";
import { PageLoadSkeleton } from "@/components/public/LoadingStates";
import type { ContactFormData } from "@/types";

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  github: <Github size={18} />,
  linkedin: <Linkedin size={18} />,
  twitter: <Twitter size={18} />,
  x: <Twitter size={18} />,
  instagram: <Instagram size={18} />,
  email: <Mail size={18} />,
  whatsapp: <MessageSquare size={18} />,
  website: <Globe size={18} />,
};

export default function ContactPage() {
  const { lang } = useLanguageStore();
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const { data: contactSettings, isLoading } = useQuery({
    queryKey: ["contact-settings"],
    queryFn: publicAPI.getContactSettings,
  });
  const { data: socialLinks } = useQuery({
    queryKey: ["social-links"],
    queryFn: publicAPI.getSocialLinks,
  });

  const submitMutation = useMutation({
    mutationFn: (data: ContactFormData) => publicAPI.submitContact(data),
    onSuccess: () => setSubmitted(true),
  });

  if (isLoading) return <PageLoadSkeleton />;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    submitMutation.mutate(form);
  };

  const title =
    getText(contactSettings?.section_title, lang) ||
    (lang === "en" ? "Get In Touch" : "Hubungi Saya");
  const subtitle = getText(contactSettings?.section_subtitle, lang);

  return (
    <div className="page-section max-w-5xl">
      <div className="text-center mb-16 animate-fade-in">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
          Contact
        </p>
        <h1 className="section-title mb-4">
          <span>{title}</span>
        </h1>
        {subtitle && (
          <p className="section-subtitle mx-auto text-center">{subtitle}</p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Contact Form */}
        {contactSettings?.enable_contact_form !== false && (
          <div className="card-glass p-5 sm:p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-2xl mx-auto mb-6">
                  ✓
                </div>
                <h3 className="font-bold text-text-primary text-lg mb-2">
                  {lang === "en" ? "Message Sent!" : "Pesan Terkirim!"}
                </h3>
                <p className="text-text-secondary text-sm">
                  {getText(contactSettings?.success_message, lang) ||
                    (lang === "en"
                      ? "I'll get back to you soon."
                      : "Saya akan segera membalas.")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                      {lang === "en" ? "Name *" : "Nama *"}
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="input-cyber"
                      placeholder={lang === "en" ? "Your name" : "Nama Anda"}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                      Email *
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="input-cyber"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                    {lang === "en" ? "Subject" : "Subjek"}
                  </label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="input-cyber"
                    placeholder={
                      lang === "en" ? "What's this about?" : "Tentang apa?"
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
                    {lang === "en" ? "Message *" : "Pesan *"}
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="input-cyber resize-none"
                    placeholder={
                      lang === "en"
                        ? "Tell me about your project or idea..."
                        : "Ceritakan proyek atau ide Anda..."
                    }
                  />
                </div>

                {submitMutation.isError && (
                  <p className="text-red-400 text-sm">
                    {getText(contactSettings?.error_message, lang) ||
                      "Something went wrong. Please try again."}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="btn-primary w-full justify-center"
                >
                  {submitMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      {lang === "en" ? "Sending..." : "Mengirim..."}
                    </span>
                  ) : (
                    <>
                      <Send size={16} />{" "}
                      {lang === "en" ? "Send Message" : "Kirim Pesan"}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Social Links / Info */}
        {contactSettings?.show_social_links !== false && (
          <div className="space-y-6">
            <div className="card-glass p-6">
              <h3 className="font-bold text-text-primary mb-4">
                {lang === "en" ? "Connect With Me" : "Terhubung Dengan Saya"}
              </h3>
              <div className="space-y-3">
                {(socialLinks || []).map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target={link.open_in_new_tab ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent hover:bg-accent-glow text-text-secondary hover:text-accent-bright transition-all group"
                  >
                    {PLATFORM_ICONS[link.platform.toLowerCase()] || (
                      <ExternalLink size={16} />
                    )}
                    <div>
                      <p className="text-sm font-medium">{link.label}</p>
                      <p className="text-xs text-text-muted truncate max-w-xs">
                        {link.url.replace("mailto:", "")}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="card-glass p-6">
              <h3 className="font-semibold text-text-primary mb-3">
                {lang === "en" ? "Response Time" : "Waktu Respons"}
              </h3>
              <p className="text-sm text-text-secondary">
                {lang === "en"
                  ? "I typically respond within 24-48 hours. For urgent matters, reach out via email or LinkedIn."
                  : "Saya biasanya merespons dalam 24-48 jam. Untuk hal mendesak, hubungi via email atau LinkedIn."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
