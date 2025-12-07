import {responseStatus} from "@/types/responseStatus";
import CookieManager from '@react-native-cookies/cookies';
import useStorage from "@/hooks/use-storage";
import {useCallback} from "react";
import {CachedResponse, useScheduleResponseCache} from "@/contexts/ScheduleResponseCacheContext";

const COOKIES_STORAGE_KEY = 'aspnet_auth_cookies';

interface loginResponse {
    status: string;
    body: string;
}

const getLoginForm = async () => {
    const response = await fetch('https://planzajec.pjwstk.edu.pl/Logowanie.aspx');
    const html = await response.text();
    const viewState = html.match(/name="__VIEWSTATE"[^>]*value="([^"]+)"/)?.[1];
    const viewStateGenerator = html.match(/name="__VIEWSTATEGENERATOR"[^>]*value="([^"]+)"/)?.[1];
    const eventValidation = html.match(/name="__EVENTVALIDATION"[^>]*value="([^"]+)"/)?.[1];
    return {viewState, viewStateGenerator, eventValidation};
};

export const useScheduleAuth = () => {
    const {saveData, loadData} = useStorage();
    const {setCachedResponse} = useScheduleResponseCache();

    const login = useCallback(async (username: string, password: string): Promise<loginResponse> => {
        try {
            const formData = await getLoginForm();
            const body = new URLSearchParams({
                'RadScriptManager1_TSM': ';;System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35:en-US:ceece802-cb39-4409-a6c9-bfa3b2c8bf10:ea597d4b:b25378d2',
                '__EVENTARGUMENT': '',
                '__EVENTTARGET': '',
                '__EVENTVALIDATION': formData.eventValidation || '',
                '__VIEWSTATE': formData.viewState || '',
                '__VIEWSTATEGENERATOR': formData.viewStateGenerator || '',
                'ctl00$ContentPlaceHolder1$Login1$LoginButton': 'Zaloguj',
                'ctl00$ContentPlaceHolder1$Login1$Password': password,
                'ctl00$ContentPlaceHolder1$Login1$UserName': username
            });

            const response = await fetch('https://planzajec.pjwstk.edu.pl/Logowanie.aspx', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                body: body.toString()
            });

            const sessionCookies = await CookieManager.get('https://planzajec.pjwstk.edu.pl');
            const aspxCookieString = ".ASPXAUTH=" + sessionCookies['.ASPXAUTH']?.value;
            const aspnetCookieString = "ASP.NET_SessionId" + sessionCookies['ASP.NET_SessionId']?.value;
            const cookiesString = aspnetCookieString + "; " + aspxCookieString;

            await saveData(COOKIES_STORAGE_KEY, cookiesString);

            if (!response.ok) {
                return {
                    status: responseStatus.NETWORK_ERROR,
                    body: `Network error: ${response.status} ${response.statusText}`
                };
            }

            const responseBody = await response.text();
            if (responseBody.includes('Błędny login lub hasło. Spróbuj ponownie.')) {
                return {
                    status: responseStatus.INVALID_CREDENTIALS,
                    body: 'Invalid username or password'
                };
            }

            return {
                status: responseStatus.SUCCESS,
                body: 'Logged in as ' + username
            };
        } catch (error) {
            return {
                status: responseStatus.UNKNOWN_ERROR,
                body: 'An unknown error occurred'
            };
        }
    }, [saveData]);

    const authenticatedRequest = useCallback(async (url: string, options: RequestInit = {}): Promise<CachedResponse> => {
        const cookieString = await loadData(COOKIES_STORAGE_KEY) || '';

        if (!cookieString) {
            const errorResponse = {
                body: 'No cookies found',
                status: 401,
                headers: {},
                ok: false,
                statusText: 'Unauthorized',
                text: 'No cookies found'
            };
            setCachedResponse(errorResponse);
            return errorResponse;
        }

        const headers = {
            ...options.headers,
            'Cookie': cookieString,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        const responseText = await response.text();
        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
            responseHeaders[key] = value;
        });

        const responseCached: CachedResponse = {
            body: responseText,
            headers: responseHeaders,
            status: response.status,
            ok: response.ok,
            statusText: response.statusText,
            text: responseText
        };
        setCachedResponse(responseCached);

        return responseCached;
    }, [loadData, setCachedResponse]);

    return {
        login,
        authenticatedRequest
    };
};
