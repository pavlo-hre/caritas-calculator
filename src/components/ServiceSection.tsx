import type { FC } from "react";
import type { Section, SelectedService, ServiceType } from '../types';
import styles from "../styles/ServiceCalculator.module.css";
import ServiceItem from "./ServiceItem";

interface ServiceSectionProps {
  sectionIndex: string;
  section: Section;
  isExpanded: boolean;
  onToggleExpand: (index: string) => void;
  selectedServices: Map<string, SelectedService>;
  onAddService: (
    serviceItem: ServiceType
  ) => void;
  onIncrementService: (code: string) => void;
  onDecrementService: (code: string) => void;
  onRemoveService: (code: string) => void;
}

const ServiceSection: FC<ServiceSectionProps> = ({
  sectionIndex,
  section,
  isExpanded,
  onToggleExpand,
  selectedServices,
  onAddService,
  onIncrementService,
  onDecrementService,
  onRemoveService,
}) => {
  const headingId = `section-heading-${sectionIndex}`;
  const contentId = `section-content-${sectionIndex}`;

  return (
    <section className={styles["section"]} aria-labelledby={headingId}>
      <h2 className={styles["section-title"]}>
        <button
          type="button"
          id={headingId}
          className={styles["section-header"]}
          onClick={() => onToggleExpand(sectionIndex)}
          aria-expanded={isExpanded}
          aria-controls={contentId}
        >
          <span className={styles["section-title-text"]}>{section.section}</span>
          <span className={styles["expand-icon"]} aria-hidden="true">{isExpanded ? "▼" : "▶"}</span>
        </button>
      </h2>

      <ul id={contentId} className={styles["section-content"]} hidden={!isExpanded}>
        {section.items.map((item, itemIndex) => (
          <ServiceItem
            key={`${sectionIndex}-${itemIndex}`}
            item={item}
            itemCode={item.code}
            selectedServices={selectedServices}
            onAddService={onAddService}
            onIncrementService={onIncrementService}
            onDecrementService={onDecrementService}
            onRemoveService={onRemoveService}
          />
        ))}
      </ul>
    </section>
  );
};

export default ServiceSection;
