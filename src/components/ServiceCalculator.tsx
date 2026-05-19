import { useState, useCallback } from 'react';
import type { SelectedService, ServiceType, } from '../types';
import styles from '../styles/ServiceCalculator.module.css';
import priceData from '../../price.json';
import ServiceSection from './ServiceSection';
import ServiceItem from './ServiceItem.tsx';
import { DownloadIcon } from './icons/DownloadIcon.tsx';
import clsx from 'clsx';

export default function ServiceCalculator() {
  const [selectedServices, setSelectedServices] = useState<
    Map<string, SelectedService>
  >(new Map());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(priceData.services.map((_, index) => index.toString())),
  );

  const toggleSection = useCallback((sectionIndex: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionIndex)) {
        newSet.delete(sectionIndex);
      } else {
        newSet.add(sectionIndex);
      }
      return newSet;
    });
  }, []);

  const addService = useCallback(
    (serviceItem: ServiceType) => {
      setSelectedServices((prev) => {
        const newMap = new Map(prev);
        if (newMap.has(serviceItem.code)) {
          const service = newMap.get(serviceItem.code)!;
          service.quantity += 1;
          service.total = service.quantity * service.price;
        } else {
          const quantity = serviceItem.defaultQty && serviceItem.defaultQty !== 0 ? serviceItem.defaultQty : 1;

          newMap.set(serviceItem.code, {
            ...serviceItem,
            quantity,
            total: quantity * serviceItem.price,
          });
        }
        return newMap;
      });
    },
    [],
  );

  const incrementService = useCallback((code: string) => {
    setSelectedServices((prev) => {
      const newMap = new Map(prev);

      if (newMap.has(code)) {
        const service = newMap.get(code)!;

        const updatedService = {
          ...service,
          quantity: service.quantity + 1,
          total: (service.quantity + 1) * service.price,
        };

        newMap.set(code, updatedService);
      }

      return newMap;
    });
  }, []);

  const decrementService = useCallback((code: string) => {
    setSelectedServices((prev) => {
      const newMap = new Map(prev);

      if (newMap.has(code)) {
        const service = newMap.get(code)!;

        if (service.quantity > 1) {
          const updatedService = {
            ...service,
            quantity: service.quantity - 1,
            total: (service.quantity - 1) * service.price,
          };

          newMap.set(code, updatedService);
        } else {
          newMap.delete(code);
        }
      }

      return newMap;
    });
  }, []);

  const removeService = useCallback((code: string) => {
    setSelectedServices((prev) => {
      if (!prev.has(code)) return prev;

      const newMap = new Map(prev);
      newMap.delete(code);
      return newMap;
    });
  }, []);

  const totalPrice = Array.from(selectedServices.values()).reduce(
    (sum, service) => sum + service.total,
    0,
  );


// Export selected services and totals to PDF using html2canvas + jsPDF (dynamically imported)
  const exportToPdf = async () => {
    if (selectedServices.size === 0) return;

    // Fixed PDF pt sizes (controls final PDF text size)
    const titlePt = 16;
    const tablePt = 12;
    const totalPt = 14;

    // Convert pt to CSS px
    const ptToPx = 96 / 72;
    const titlePx = Math.round(titlePt * ptToPx);
    const tablePx = Math.round(tablePt * ptToPx);
    const padPx = Math.round(6 * (tablePx / 14));
    const totalPx = Math.round(totalPt * ptToPx);

    try {
      const jspdfModule = await import('jspdf');
      const jsPDF = (jspdfModule as any).jsPDF ?? (jspdfModule as any).default ?? jspdfModule;
      const doc: any = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfPageHeight = doc.internal.pageSize.getHeight();
      const margin = 10; // mm
      const usableWidth = pdfWidth - margin * 2; // mm

      // Convert mm to CSS px
      const pxPerMm = 96 / 25.4;
      const containerWidthPx = Math.round(usableWidth * pxPerMm);

      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.background = '#fff';
      container.style.padding = '0px';
      container.style.fontFamily = 'Arial, Helvetica, sans-serif';
      container.style.color = '#111';
      container.style.width = `${containerWidthPx}px`;
      container.style.boxSizing = 'border-box';

      // heading
      const heading = document.createElement('h2');
      heading.innerText = 'Послуги центру догляду вдома Карітас Запоріжжя на місяць';
      heading.style.fontSize = `${titlePx}px`;
      heading.style.margin = `0 0 ${Math.round(padPx * 1.5)}px 0`;
      container.appendChild(heading);

      // table
      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.fontSize = `${tablePx}px`;

      const thead = document.createElement('thead');
      const headRow = document.createElement('tr');
      const headers = ['Код', 'Назва', 'К-сть', 'Ціна (грн)', 'Разом (грн)'];
      const headerAlign = ['left', 'left', 'right', 'right', 'right'];
      headers.forEach((text, i) => {
        const th = document.createElement('th');
        th.innerText = text;
        th.style.textAlign = headerAlign[i];
        th.style.padding = `${padPx}px`;
        th.style.borderBottom = '1px solid #ddd';
        headRow.appendChild(th);
      });
      thead.appendChild(headRow);
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      Array.from(selectedServices.values()).forEach((s) => {
        const row = document.createElement('tr');

        const tdCode = document.createElement('td');
        tdCode.innerText = String(s.code);
        tdCode.style.padding = `${padPx}px`;
        tdCode.style.verticalAlign = 'top';
        tdCode.style.borderBottom = '1px solid #eee';
        row.appendChild(tdCode);

        const tdName = document.createElement('td');
        tdName.innerText = String(s.name);
        tdName.style.padding = `${padPx}px`;
        tdName.style.verticalAlign = 'top';
        tdName.style.borderBottom = '1px solid #eee';
        row.appendChild(tdName);

        const tdQty = document.createElement('td');
        tdQty.innerText = String(s.quantity);
        tdQty.style.padding = `${padPx}px`;
        tdQty.style.verticalAlign = 'top';
        tdQty.style.textAlign = 'right';
        tdQty.style.borderBottom = '1px solid #eee';
        row.appendChild(tdQty);

        const tdPrice = document.createElement('td');
        tdPrice.innerText = String(s.price);
        tdPrice.style.padding = `${padPx}px`;
        tdPrice.style.verticalAlign = 'top';
        tdPrice.style.textAlign = 'right';
        tdPrice.style.borderBottom = '1px solid #eee';
        row.appendChild(tdPrice);

        const tdTotal = document.createElement('td');
        tdTotal.innerText = String(s.total);
        tdTotal.style.padding = `${padPx}px`;
        tdTotal.style.verticalAlign = 'top';
        tdTotal.style.textAlign = 'right';
        tdTotal.style.borderBottom = '1px solid #eee';
        row.appendChild(tdTotal);

        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      container.appendChild(table);

      const totalDiv = document.createElement('div');
      totalDiv.innerText = `Загальна вартість: ${totalPrice} грн`;
      totalDiv.style.marginTop = `${Math.round(padPx * 1.7)}px`;
      totalDiv.style.fontWeight = '700';
      totalDiv.style.fontSize = `${totalPx}px`;
      container.appendChild(totalDiv);

      document.body.appendChild(container);

      const html2canvasModule = await import('html2canvas');
      const html2canvas = (html2canvasModule as any).default ?? html2canvasModule;

      const canvasScale = Math.max(1, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
      const canvas = await html2canvas(container, { scale: canvasScale });
      document.body.removeChild(container);

      // Get Full Image Data URL
      const imgDataUrl = canvas.toDataURL('image/png');

      // Calculate full dimensions in mm relative to our usable width
      const imgWidthMm = usableWidth;
      const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

      const usablePageHeightMm = pdfPageHeight - margin * 2;
      let heightLeftMm = imgHeightMm;
      let positionYMm = margin;

      // First page
      doc.addImage(imgDataUrl, 'PNG', margin, positionYMm, imgWidthMm, imgHeightMm, undefined, 'FAST');
      heightLeftMm -= usablePageHeightMm;

      // Subsequent pages
      while (heightLeftMm > 0) {
        positionYMm = heightLeftMm - imgHeightMm + margin; // Shift image upwards contextually
        doc.addPage();
        doc.addImage(imgDataUrl, 'PNG', margin, positionYMm, imgWidthMm, imgHeightMm, undefined, 'FAST');
        heightLeftMm -= usablePageHeightMm; // Guarantee structural subtraction to prevent infinite loop
      }

      const fileName = `Розрахунок послуг догляд вдома ${Date.now()}.pdf`;
      doc.save(fileName);

    } catch (err) {
      // Fallback: try jsPDF + autotable
      try {
        const { jsPDF } = await import('jspdf');
        await import('jspdf-autotable');

        const doc: any = new jsPDF();
        const titleSize = Math.max(12, titlePt);
        const tableFont = Math.max(8, tablePt);
        const totalSize = Math.max(10, totalPt);

        doc.setFontSize(titleSize);
        doc.text('Послуги центру догляду вдома Карітас Запоріжжя на місяць', 14, 14);

        const rows = Array.from(selectedServices.values()).map((s) => [
          s.code,
          s.name,
          ` ${s.quantity}`,
          `${s.price}`,
          `${s.total}`,
        ]);

        (doc as any).autoTable({
          head: [['Код', 'Назва', 'К-сть', 'Ціна (грн)', 'Разом (грн)']],
          body: rows,
          startY: 20,
          styles: { fontSize: Math.max(8, tableFont) },
          headStyles: { fillColor: [30, 64, 175] },
        });

        const finalY = (doc as any).lastAutoTable?.finalY ?? 20;
        doc.setFontSize(Math.max(10, totalSize));
        doc.text(`Загальна вартість: ${totalPrice} грн`, 14, finalY + 10);

        const fileName = `Розрахунок послуг догляд вдома ${Date.now()}.pdf`;
        doc.save(fileName);
      } catch (err2) {
        console.error('Failed to export PDF', err2);
        alert('Не вдалося експортувати PDF. Встановіть залежності або спробуйте пізніше.');
      }
    }
  };

  return (
    <div className={styles['calculator-container']}>
      <div className={styles['calculator-content']}>
        <div className={styles['services-list']}>
          <h1>Калькулятор цін на послуги центру догляду вдома на місяць</h1>
          {priceData.services.map((sectionData: any, index) => (
            <ServiceSection
              key={index}
              sectionIndex={index.toString()}
              section={sectionData}
              isExpanded={expandedSections.has(index.toString())}
              onToggleExpand={toggleSection}
              selectedServices={selectedServices}
              onAddService={addService}
              onIncrementService={incrementService}
              onDecrementService={decrementService}
              onRemoveService={removeService}
            />
          ))}
        </div>

        {selectedServices.size !== 0 && (
          <div className={styles['totals-section']}>
            <h2>Вибрані послуги</h2>
            <>
              <div className={styles['selected-services-list']}>
                {Array.from(selectedServices.values()).map((service) => (
                  <ServiceItem
                    key={`${service.code}`}
                    item={service}
                    itemCode={service.code}
                    selectedServices={selectedServices}
                    onAddService={() => {
                    }}
                    onIncrementService={incrementService}
                    onDecrementService={decrementService}
                    onRemoveService={removeService}
                    totalMode={true}
                  />
                ))}
              </div>

              <div className={styles['totals']}>
                <div
                  className={`${styles['total-row']} ${styles['total-price-row']}`}
                >
                  <span className={styles.totalPriceText}>Загальна вартість:</span>
                  <span
                    className={`${styles['total-value']} ${styles['total-price']}`}
                  >
                    {totalPrice} грн
                  </span>
                </div>
              </div>
            </>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <button className={clsx(styles['btn-primary'], styles.exportBtn )} onClick={exportToPdf}>
                Завантажити PDF
                <DownloadIcon />
              </button>
            </div>
          </div>)}
      </div>
    </div>
  );
}
