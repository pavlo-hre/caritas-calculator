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
  return (
    <div className={styles["section"]}>
      <button
        className={styles["section-header"]}
        onClick={() => onToggleExpand(sectionIndex)}
        aria-expanded={isExpanded}
      >
        <h2>{section.section}</h2>
        <span className={styles["expand-icon"]}>{isExpanded ? "▼" : "▶"}</span>
      </button>

      {isExpanded && (
        <div className={styles["section-content"]}>
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
        </div>
      )}
    </div>
  );
};

export default ServiceSection;
