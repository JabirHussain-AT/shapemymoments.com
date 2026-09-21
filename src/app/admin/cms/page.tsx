import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SITE_DEFAULTS, getDemoFaqs } from "@/lib/data";

export const metadata = { title: "CMS", robots: { index: false } };

export default function AdminCmsPage() {
  const faqs = getDemoFaqs();

  return (
    <AdminShell title="CMS">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold">Homepage hero</h2>
          <div className="mt-4 space-y-3">
            <div>
              <Label>Headline</Label>
              <Textarea defaultValue={SITE_DEFAULTS.hero.headline} rows={2} />
            </div>
            <div>
              <Label>Subheadline</Label>
              <Textarea defaultValue={SITE_DEFAULTS.hero.subheadline} rows={3} />
            </div>
            <div>
              <Label>Primary CTA</Label>
              <Input defaultValue={SITE_DEFAULTS.hero.primaryCta} />
            </div>
            <Button>Save hero</Button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold">Contact & social</h2>
          <div className="mt-4 space-y-3">
            <div>
              <Label>Email</Label>
              <Input defaultValue={SITE_DEFAULTS.email} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input defaultValue={SITE_DEFAULTS.phone} />
            </div>
            <div>
              <Label>Address</Label>
              <Input defaultValue={SITE_DEFAULTS.address} />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input placeholder="https://instagram.com/..." />
            </div>
            <Button>Save contact</Button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="font-semibold">FAQs</h2>
          <ul className="mt-4 space-y-3">
            {faqs.map((faq) => (
              <li key={faq.question} className="rounded-xl bg-muted/50 p-4">
                <p className="font-medium">{faq.question}</p>
                <p className="mt-1 text-sm text-muted-foreground">{faq.answer}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}
