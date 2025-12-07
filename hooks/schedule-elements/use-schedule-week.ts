import {useScheduleResponseCache} from "@/contexts/ScheduleResponseCacheContext";
import {parseDocument} from 'htmlparser2';
import {getElementById, getElementsByClassName, getElementsByTagName, textContent} from 'domutils';

export const useScheduleWeek = () => {
    const {getCachedResponse} = useScheduleResponseCache();

    const getScheduleWeek = (): string | null => {
        const response = getCachedResponse();
        if (!response || !response.ok) {
            console.error('Cannot get schedule week, cached response is invalid or missing.');
            return null;
        }

        try {
            const html = response.text;
            const dom = parseDocument(html);

            const scheduleElement = getElementById('ctl00_ContentPlaceHolder1_DedykowanyPlanStudenta_PlanZajecRadScheduler', dom.children);
            if (!scheduleElement) return null;

            const topWrapElement = getElementsByClassName('rsTopWrap', scheduleElement.children)[0];
            if (!topWrapElement) return null;

            const rsHeader = getElementsByClassName('rsHeader', topWrapElement.children)[0];
            if (!rsHeader) return null;

            const weekElement = getElementsByTagName('h2', rsHeader.children)[0];
            if (!weekElement) return null;

            return textContent(weekElement).trim().replace(/\s+/g, ' ');
        } catch (error) {
            console.error('Error parsing schedule week from cached response:', error);
            return null;
        }
    };

    return {
        getScheduleWeek
    };
};
