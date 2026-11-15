"use client";

import {
  ArrowLeft,
  Award,
  Calendar,
  Eye,
  GraduationCap,
  Lock,
  Mail,
  MessageCircle,
  MessageSquareText,
  School,
  Settings,
  UserCheck,
  UserX,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ApiError } from "@/lib/api";
import { formatPersonName, getPublicScholarProfile, type PublicScholarProfile } from "@/lib/api/auth";
import { ScholarProfileSkeleton } from "../components/ScholarProfileSkeleton";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; profile: PublicScholarProfile }
  | { status: "private"; message: string }
  | { status: "not_found"; message: string }
  | { status: "error"; message: string };

function PublicInfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-line/60 last:border-0">
      <div className="flex items-center gap-2 text-muted-foreground shrink-0">
        <Icon className="size-4 text-navy/70" />
        <span className="text-xs">{label}</span>
      </div>
      <span className="text-xs sm:text-sm font-semibold text-navy text-right truncate max-w-[60%]">{value}</span>
    </div>
  );
}

function formatMonthYear(dateValue: string): string {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "Scholar Member";
  return parsed.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

export default function ScholarPublicProfilePage() {
  const params = useParams<{ id: string }>();
  const rawId = typeof params?.id === "string" ? params.id : "";
  const targetUserId = Number.parseInt(rawId, 10);

  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    if (!Number.isInteger(targetUserId) || targetUserId <= 0) {
      setState({ status: "not_found", message: "Invalid scholar profile link." });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    getPublicScholarProfile(targetUserId)
      .then((profile) => {
        if (!cancelled) {
          setState({ status: "ready", profile });
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError) {
          if (err.status === 403) {
            setState({
              status: "private",
              message: err.message || "This scholar has chosen to keep their profile private.",
            });
            return;
          }
          if (err.status === 404) {
            setState({
              status: "not_found",
              message: err.message || "Scholar profile could not be found.",
            });
            return;
          }
          setState({ status: "error", message: err.message });
          return;
        }
        setState({ status: "error", message: "Failed to load scholar profile." });
      });

    return () => {
      cancelled = true;
    };
  }, [targetUserId]);

  if (state.status === "loading") {
    return (
      <div className="min-h-full bg-[#FAF9F7]">
        <PageHeader title="Scholar Profile" subtitle="Viewing scholar public profile." className="md:hidden" />
        <div className="px-3.5 py-4 sm:px-8 sm:py-8">
          <ScholarProfileSkeleton />
        </div>
      </div>
    );
  }

  if (state.status === "private") {
    return (
      <div className="min-h-full bg-[#FAF9F7] pb-24">
        <PageHeader title="Private Profile" subtitle="This scholar profile is not public." className="md:hidden" />
        <div className="px-3.5 py-6 sm:px-8 sm:py-10">
          <div className="mx-auto w-full max-w-2xl space-y-4">
            <Link
              href="/SchoForum"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-navy hover:underline"
            >
              <ArrowLeft className="size-4" />
              Back to Forum
            </Link>

            <Card className="rounded-2xl border border-line bg-white shadow-xs">
              <CardContent className="p-8 sm:p-10 text-center space-y-4">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-800">
                  <Lock className="size-7" />
                </div>
                <div className="space-y-1.5">
                  <h1 className="text-xl font-bold text-navy">This Profile is Private</h1>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    {state.message} When public profile visibility is turned off in settings, other scholars cannot view
                    their profile details, bio, or forum activity.
                  </p>
                </div>
                <div className="pt-2">
                  <Button asChild className="bg-navy hover:bg-navy/90 text-white! font-medium px-6">
                    <Link href="/SchoForum" className="text-white!">
                      Return to Forum
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (state.status === "not_found" || state.status === "error") {
    return (
      <div className="min-h-full bg-[#FAF9F7] pb-24">
        <PageHeader title="Scholar Profile" subtitle="Profile unavailable." className="md:hidden" />
        <div className="px-3.5 py-6 sm:px-8 sm:py-10">
          <div className="mx-auto w-full max-w-2xl space-y-4">
            <Link
              href="/SchoForum"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-navy hover:underline"
            >
              <ArrowLeft className="size-4" />
              Back to Forum
            </Link>

            <Card className="rounded-2xl border border-line bg-white shadow-xs">
              <CardContent className="p-8 sm:p-10 text-center space-y-4">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-navy">
                  <UserX className="size-7" />
                </div>
                <div className="space-y-1.5">
                  <h1 className="text-xl font-bold text-navy">Scholar Profile Unavailable</h1>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">{state.message}</p>
                </div>
                <div className="pt-2">
                  <Button asChild className="bg-navy hover:bg-navy/90 text-white! font-medium px-6">
                    <Link href="/SchoForum" className="text-white!">
                      Return to Forum
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const { profile } = state;
  const displayName = formatPersonName(profile, "Scholar");
  const initials = ((profile.first_name?.[0] ?? "") + (profile.last_name?.[0] ?? "")).toUpperCase() || "SC";
  const subtitle =
    [profile.course_of_study, profile.school_name].filter(Boolean).join(" • ") || "Active Beneficiary (Scholar)";
  const bannerStyle = profile.banner_url
    ? { backgroundImage: `url(${profile.banner_url})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: "linear-gradient(120deg, #14283F 0%, #1E3A5F 100%)" };

  return (
    <div className="min-h-full bg-[#FAF9F7] pb-24">
      <PageHeader title={displayName} subtitle="Scholar Public Profile" className="md:hidden" />
      <div className="px-3.5 py-4 sm:px-8 sm:py-8">
        <div className="mx-auto w-full max-w-4xl space-y-4 sm:space-y-6">
          {/* Top Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/SchoForum"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-navy hover:underline"
            >
              <ArrowLeft className="size-4" />
              Back to Forum
            </Link>

            {profile.is_self && (
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="border-line bg-white text-navy">
                  <Link href="/schoProfile">My Full Profile</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="border-line bg-white text-navy gap-1.5">
                  <Link href="/scholarSettings">
                    <Settings className="size-3.5" />
                    Privacy Settings
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {profile.is_self && !profile.is_public && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs sm:text-sm text-amber-950">
              <div className="flex items-start sm:items-center gap-2.5">
                <Lock className="size-4 shrink-0 mt-0.5 sm:mt-0 text-amber-800" />
                <span>
                  Your <strong>Public profile</strong> setting is currently <strong>OFF</strong>. Other scholars cannot
                  view your profile until you enable it in Settings.
                </span>
              </div>
              <Link href="/scholarSettings" className="font-semibold underline shrink-0">
                Go to Settings
              </Link>
            </div>
          )}

          {/* Banner */}
          <div
            className="relative h-44 sm:h-52 w-full rounded-2xl shadow-xs border border-line overflow-hidden"
            style={bannerStyle}
          />

          {/* Header (Avatar, Full Name, Subtitle) */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 px-2 sm:px-4">
            <div className="flex items-end gap-3.5 sm:gap-4 min-w-0">
              <div className="relative shrink-0">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={displayName}
                    width={112}
                    height={112}
                    unoptimized
                    className="size-24 sm:size-28 rounded-full border-4 border-white object-cover shadow-md bg-white"
                  />
                ) : (
                  <div className="flex size-24 sm:size-28 items-center justify-center rounded-full border-4 border-white bg-[#F3E6C8] text-[#7A5C0A] text-2xl sm:text-3xl font-bold shadow-md">
                    {initials}
                  </div>
                )}
              </div>

              <div className="min-w-0 pb-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-xl sm:text-2xl font-bold text-navy">{displayName}</h1>
                  <Badge
                    variant="outline"
                    className="rounded-full bg-amber-50 text-amber-800 border-amber-200 text-[0.68rem] font-semibold"
                  >
                    Scholar
                  </Badge>
                </div>
                <p className="truncate text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 self-start sm:self-end rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-2xs">
              <Calendar className="size-3.5 text-navy/70" />
              <span>Member since {formatMonthYear(profile.member_since)}</span>
            </div>
          </div>

          {/* Bio Card */}
          <Card className="rounded-xl border border-line bg-white shadow-xs">
            <CardContent className="p-5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">About &amp; Bio</p>
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {profile.bio || "This scholar hasn't added a bio yet."}
              </p>
            </CardContent>
          </Card>

          {/* Academic & Contact Overview */}
          <Card className="rounded-xl border border-line bg-white shadow-xs">
            <CardContent className="p-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Academic &amp; Contact</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                <PublicInfoRow
                  icon={School}
                  label="Enrolled University"
                  value={profile.school_name || "Not specified"}
                />
                <PublicInfoRow
                  icon={GraduationCap}
                  label="Degree Program"
                  value={profile.course_of_study || "Not specified"}
                />
                <PublicInfoRow
                  icon={UserCheck}
                  label="Year Level"
                  value={profile.current_year_level ? `Year ${profile.current_year_level}` : "Not specified"}
                />
                <PublicInfoRow
                  icon={Award}
                  label="Scholarship Track"
                  value={profile.scholarship_track || "Not specified"}
                />
                <PublicInfoRow icon={Mail} label="Email" value={profile.email} />
              </div>
            </CardContent>
          </Card>

          {/* Forum Activity */}
          <Card className="rounded-xl border border-line bg-white shadow-xs">
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Forum Activity</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MessageSquareText className="size-3.5 text-navy" />
                    <strong className="font-bold text-navy">{profile.forum_posts_count}</strong>{" "}
                    {profile.forum_posts_count === 1 ? "discussion" : "discussions"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MessageCircle className="size-3.5 text-navy" />
                    <strong className="font-bold text-navy">{profile.forum_comments_count}</strong>{" "}
                    {profile.forum_comments_count === 1 ? "reply" : "replies"}
                  </span>
                </div>
              </div>

              {profile.recent_posts.length > 0 ? (
                <div className="divide-y divide-line/60 rounded-xl border border-line/70 bg-[#FAF9F7]/60">
                  {profile.recent_posts.map((post) => (
                    <Link
                      key={post.post_id}
                      href={`/SchoForum?postId=${post.post_id}`}
                      className="flex items-center justify-between gap-3 p-3.5 transition-colors hover:bg-white"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-navy">{post.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(post.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MessageCircle className="size-3.5" />
                          {post.comments_count}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Eye className="size-3.5" />
                          {post.views_count}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No forum discussions started yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
