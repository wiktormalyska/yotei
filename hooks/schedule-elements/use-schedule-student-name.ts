import {useScheduleResponseCache} from "@/contexts/ScheduleResponseCacheContext";

export const useScheduleStudentName = () => {
    const {getCachedResponse} = useScheduleResponseCache();

    const getStudentName = (): string | null => {
        const response = getCachedResponse();
        if (!response || !response.ok) {
            console.error('Cannot get student name, cached response is invalid or missing.');
            return null;
        }

        try {
            const html = response.text;
            const nameMatch = html.match(/id="lblZalogowany"[^>]*>([^<]+)</i);
            return nameMatch?.[1]?.trim().split(": ")[1] || null;
        } catch (error) {
            console.error('Error parsing student name from cached response:', error);
            return null;
        }
    };

    return {getStudentName};
};
