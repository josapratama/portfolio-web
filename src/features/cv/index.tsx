export type {
  CVData,
  CVTemplate,
  CVPageSize,
  CVExperience,
  CVSkillGroup,
  CVEducation,
} from "./types";
export { ClassicTemplate } from "./templates/ClassicTemplate";
export { MinimalTemplate } from "./templates/MinimalTemplate";
export { ModernTemplate } from "./templates/ModernTemplate";
export { BoldTemplate } from "./templates/BoldTemplate";
export { ElegantTemplate } from "./templates/ElegantTemplate";
export { TechTemplate } from "./templates/TechTemplate";
export { ExecutiveTemplate } from "./templates/ExecutiveTemplate";
export { CreativeTemplate } from "./templates/CreativeTemplate";
export { CompactTemplate } from "./templates/CompactTemplate";
export { TimelineTemplate } from "./templates/TimelineTemplate";
export { AcademicTemplate } from "./templates/AcademicTemplate";
export { NordicTemplate } from "./templates/NordicTemplate";
export { DarkTemplate } from "./templates/DarkTemplate";
export { SplitTemplate } from "./templates/SplitTemplate";
export { CorporateTemplate } from "./templates/CorporateTemplate";
export { InfographicTemplate } from "./templates/InfographicTemplate";
export { PastelTemplate } from "./templates/PastelTemplate";
export { MonoTemplate } from "./templates/MonoTemplate";
export { MidnightTemplate } from "./templates/MidnightTemplate";
export { GradientTemplate } from "./templates/GradientTemplate";

import { ClassicTemplate } from "./templates/ClassicTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";
import { BoldTemplate } from "./templates/BoldTemplate";
import { ElegantTemplate } from "./templates/ElegantTemplate";
import { TechTemplate } from "./templates/TechTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { CompactTemplate } from "./templates/CompactTemplate";
import { TimelineTemplate } from "./templates/TimelineTemplate";
import { AcademicTemplate } from "./templates/AcademicTemplate";
import { NordicTemplate } from "./templates/NordicTemplate";
import { DarkTemplate } from "./templates/DarkTemplate";
import { SplitTemplate } from "./templates/SplitTemplate";
import { CorporateTemplate } from "./templates/CorporateTemplate";
import { InfographicTemplate } from "./templates/InfographicTemplate";
import { PastelTemplate } from "./templates/PastelTemplate";
import { MonoTemplate } from "./templates/MonoTemplate";
import { MidnightTemplate } from "./templates/MidnightTemplate";
import { GradientTemplate } from "./templates/GradientTemplate";
import type { CVData, CVTemplate, CVPageSize } from "./types";

export function CVDocument({
  cv,
  template = "classic",
  pageSize = "A4",
}: {
  cv: CVData;
  template?: CVTemplate;
  pageSize?: CVPageSize;
}) {
  const size = pageSize;
  if (template === "minimal") return <MinimalTemplate cv={cv} size={size} />;
  if (template === "modern") return <ModernTemplate cv={cv} size={size} />;
  if (template === "bold") return <BoldTemplate cv={cv} size={size} />;
  if (template === "elegant") return <ElegantTemplate cv={cv} size={size} />;
  if (template === "tech") return <TechTemplate cv={cv} size={size} />;
  if (template === "executive")
    return <ExecutiveTemplate cv={cv} size={size} />;
  if (template === "creative") return <CreativeTemplate cv={cv} size={size} />;
  if (template === "compact") return <CompactTemplate cv={cv} size={size} />;
  if (template === "timeline") return <TimelineTemplate cv={cv} size={size} />;
  if (template === "academic") return <AcademicTemplate cv={cv} size={size} />;
  if (template === "nordic") return <NordicTemplate cv={cv} size={size} />;
  if (template === "dark") return <DarkTemplate cv={cv} size={size} />;
  if (template === "split") return <SplitTemplate cv={cv} size={size} />;
  if (template === "corporate")
    return <CorporateTemplate cv={cv} size={size} />;
  if (template === "infographic")
    return <InfographicTemplate cv={cv} size={size} />;
  if (template === "pastel") return <PastelTemplate cv={cv} size={size} />;
  if (template === "mono") return <MonoTemplate cv={cv} size={size} />;
  if (template === "midnight") return <MidnightTemplate cv={cv} size={size} />;
  if (template === "gradient") return <GradientTemplate cv={cv} size={size} />;
  return <ClassicTemplate cv={cv} size={size} />;
}
