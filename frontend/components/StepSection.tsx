import { type ReactNode } from "react";

type Step = 1 | 2 | 3;

type Props = {
  step: Step;
  title: string;
  /** STEP 제목 아래 설명 한두 문단 */
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function StepSection({ step, title, description, children, className = "" }: Props) {
  return (
    <section
      id={`step-${step}`}
      aria-labelledby={`heading-step-${step}`}
      className={`scroll-mt-24 pt-12 md:scroll-mt-28 md:pt-14 ${step > 1 ? "mt-16 border-t border-slate-200/80" : "mt-10"} ${className}`}
    >
      <header className="max-w-3xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-700 md:text-xs">
          STEP {step}
        </p>
        <h2 id={`heading-step-${step}`} className="mt-2 text-xl font-bold text-slate-900 md:text-2xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
        ) : null}
      </header>
      <div className="mt-8">{children}</div>
    </section>
  );
}
