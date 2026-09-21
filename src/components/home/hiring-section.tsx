"use client";

import { Briefcase, Sparkles, MessageCircle, Mail, AlertCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getWhatsAppUrl } from "@/lib/utils";

export function HiringSection() {
  const openApplicationWhatsApp = () => {
    const text = "Hi ShapeMyMoment Team! I would like to submit my resume/portfolio for future career opportunities at ShapeMyMoment.";
    window.open(getWhatsAppUrl(text), "_blank");
  };

  return (
    <section id="hiring-section" className="section-padding bg-background border-t border-border/60">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            <Briefcase className="h-4 w-4" /> Careers at ShapeMyMoment
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Join Our Growing Creative &amp; Event Network
          </h2>
          <p className="mt-3 text-muted-foreground sm:text-lg">
            We build unforgettable experiences across Wayanad, Kochi, Kozhikode, and all of South India.
          </p>
        </div>

        {/* No Vacancies Available Card */}
        <div className="mt-10 mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-sm text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <AlertCircle className="h-8 w-8 text-amber-500" />
          </div>

          <div className="space-y-2">
            <Badge variant="outline" className="text-xs font-bold border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300">
              🔴 No Open Vacancies Available Right Now
            </Badge>
            <h3 className="text-xl font-extrabold text-foreground">
              Currently Not Hiring Active Roles
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              We currently do not have any open vacancies or immediate job openings listed. However, as our creative and event network expands across South India, new positions open up frequently!
            </p>
          </div>

          {/* Future Applications Callout */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-left space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <Sparkles className="h-4 w-4 shrink-0" /> Submit Your Resume for Future Vacancies
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If you are an event planner, photographer, media creator, decor designer, or partner relations specialist, share your profile with us. Our HR team will reach out to you first as soon as a suitable vacancy arises!
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Button
                size="sm"
                onClick={openApplicationWhatsApp}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2 shadow-xs"
              >
                <MessageCircle className="h-4 w-4" /> Share CV on WhatsApp
              </Button>

              <a
                href="mailto:careers@shapemymoment.com?subject=Future Career Opportunities - CV Submission"
                className="w-full sm:w-auto"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto text-xs font-bold gap-2"
                >
                  <Mail className="h-4 w-4" /> Email Resume (careers@shapemymoment.com)
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
