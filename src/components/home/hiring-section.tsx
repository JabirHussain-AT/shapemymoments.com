"use client";

import { useState } from "react";
import { Briefcase, MapPin, Sparkles, Send, CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getWhatsAppUrl } from "@/lib/utils";
import { toast } from "sonner";

const OPEN_POSITIONS = [
  {
    id: "job-event-coordinator",
    title: "Event Operations & On-Day Coordinator",
    department: "Event Management",
    location: "Wayanad / Kochi / Kozhikode",
    type: "Full-Time / Freelance",
    experience: "1-3 Years",
    description: "Manage vendor execution, timeline coordination, and client hospitality on event days.",
    requirements: ["Experience in event execution", "Fluency in Malayalam & English", "Strong problem solving"],
  },
  {
    id: "job-vendor-manager",
    title: "Regional Creative & Vendor Network Manager",
    department: "Partner Relations",
    location: "Kochi / Calicut / Bangalore",
    type: "Full-Time",
    experience: "2+ Years",
    description: "Onboard, verify, and quality-check photographers, hamper designers, henna artists, and makeup artists.",
    requirements: ["Strong network in South India", "Quality assessment eye", "Vendor negotiation"],
  },
  {
    id: "job-content-creator",
    title: "Social Media & Event Reels Creator",
    department: "Media & Marketing",
    location: "Wayanad / Remote",
    type: "Part-Time / Contract",
    experience: "Freshers / Experienced",
    description: "Capture behind-the-scenes event moments, edit viral Instagram Reels, and interview creative partners.",
    requirements: ["Smartphone / Camera video editing skills", "Trendy Reels sense", "Fast turnaround"],
  },
  {
    id: "job-decor-designer",
    title: "Event Decor & Concept Designer",
    department: "Creative Design",
    location: "Wayanad / Kochi",
    type: "Full-Time",
    experience: "2-4 Years",
    description: "Design custom theme setups, floral installations, and personalized hamper aesthetics.",
    requirements: ["Portfolio in stage/party decor", "3D/2D rendering skill is a plus", "Attention to detail"],
  },
];

export function HiringSection() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const applyViaWhatsApp = (jobTitle: string) => {
    const text = `Hi ShapeMyMoment Careers Team! I would like to apply for the "${jobTitle}" position. Here is a link to my CV/Portfolio:`;
    window.open(getWhatsAppUrl(text), "_blank");
  };

  return (
    <section id="hiring-section" className="section-padding bg-background border-t border-border/60">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-4 w-4" /> We&apos;re Growing &amp; Hiring
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Join South India&apos;s Premier Event &amp; Creative Team
          </h2>
          <p className="mt-3 text-muted-foreground sm:text-lg">
            We are expanding our team across Wayanad, Kochi, Kozhikode, and Bangalore. Shape unforgettable moments with us!
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {OPEN_POSITIONS.map((job) => (
            <div
              key={job.id}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs transition duration-300 hover:border-primary/50 hover:shadow-md"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="outline" className="text-xs font-semibold">
                    {job.department}
                  </Badge>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
                    {job.type}
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-bold text-card-foreground group-hover:text-primary transition">
                  {job.title}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-primary shrink-0" />
                    {job.experience}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {job.description}
                </p>

                <div className="mt-4 border-t border-border/50 pt-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Key Requirements:
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                <a
                  href={`mailto:careers@shapemymoment.com?subject=Application for ${encodeURIComponent(job.title)}`}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Email Resume
                </a>

                <Button
                  size="sm"
                  onClick={() => applyViaWhatsApp(job.title)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs"
                >
                  <MessageCircle className="h-4 w-4" /> Apply via WhatsApp
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* General Application Callout */}
        <div className="mt-12 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-purple-500/10 to-amber-500/10 p-8 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
          <div>
            <h3 className="text-xl font-bold">Don&apos;t see your role?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We&apos;re always looking for passionate planners, artists, and logistics managers. Send us your resume anytime.
            </p>
          </div>
          <a
            href={getWhatsAppUrl("Hi ShapeMyMoment Careers! I'd like to submit an open job application / resume.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 sm:mt-0 shrink-0"
          >
            <Button className="gap-2 shadow-md">
              Send Open Application <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
