// App.jsx
import React, { useRef, useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";
import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  CssBaseline,
} from "@mui/material";
import MicNoneIcon from "@mui/icons-material/MicNone";
import LanguageIcon from "@mui/icons-material/Language";

/*
  Replace these placeholders with your real keys/assistant IDs:
*/
const PUBLIC_KEY = "0302fb41-0e02-49d1-814b-f147124c073f";
const ASSISTANT_ID_ENGLISH = "d4896898-e290-4adc-90fe-1e56727e0746";
const ASSISTANT_ID_ARABIC = "c69d0aaf-d6fd-4ae4-a4ba-be9e194b0a7d";

export default function App() {
  const vapiRef = useRef(null);
  const [language, setLanguage] = useState("en"); // 'en' or 'ar'
  const [isListening, setIsListening] = useState(false);
  const [statusText, setStatusText] = useState("Idle");

  // Create Vapi lazily
  function ensureClient() {
    if (!vapiRef.current) {
      vapiRef.current = new Vapi(PUBLIC_KEY);
      // optional: bind generic events if the SDK supports them
      if (typeof vapiRef.current.on === "function") {
        vapiRef.current.on("end", () => {
          setIsListening(false);
          setStatusText("Idle");
        });
        vapiRef.current.on("error", (e) => {
          setIsListening(false);
          setStatusText("Error");
          console.error("Vapi error:", e);
        });
      }
    }
    return vapiRef.current;
  }

  const startListening = async () => {
    setStatusText("Requesting microphone...");
    // Optionally check for microphone availability/permission
    try {
      // ensure client created
      const client = ensureClient();
      const assistantId =
        language === "en" ? ASSISTANT_ID_ENGLISH : ASSISTANT_ID_ARABIC;

      // start accepts string assistant id, not an object
      await client.start(assistantId);

      setIsListening(true);
      setStatusText("Listening...");
    } catch (err) {
      console.error("startListening failed:", err);
      setIsListening(false);
      setStatusText("Failed to start");
      // Show helpful message in console / UI
    }
  };

  const stopListening = async () => {
    setStatusText("Stopping...");
    try {
      if (vapiRef.current?.stop) await vapiRef.current.stop();
      if (vapiRef.current?.end) await vapiRef.current.end();
    } catch (e) {
      // ignore
    } finally {
      setIsListening(false);
      setStatusText("Idle");
    }
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        vapiRef.current?.end?.();
      } catch (e) {}
      vapiRef.current = null;
    };
  }, []);

  // UI adjustments for RTL when language === 'ar'
  const isRtl = language === "ar";

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#0F172A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: { xs: "96%", sm: 760 },
            borderRadius: 3,
            px: { xs: 3, sm: 6 },
            py: { xs: 4, sm: 6 },
            textAlign: isRtl ? "right" : "center",
            direction: isRtl ? "rtl" : "ltr",
            background:
              "linear-gradient(180deg, rgba(15,23,42,1) 0%, rgba(7,10,24,1) 100%)",
            color: "#E6EEF8",
          }}
        >
          <Box
            component="img"
            src="/bbk-logo1.png" // or import logo from './logo.png' if using src
            alt="Logo"
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              maxWidth: 100, // optional: limit width
              height: "auto",
            }}
          />
          <Stack spacing={2} alignItems="center">
            <Box sx={{ maxWidth: 680 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {isRtl
                  ? "كيف يمكنني مساعدتك اليوم؟"
                  : "How can I assist you today?"}
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{ mt: 1, color: "rgba(230,238,248,0.8)" }}
              >
                {isRtl
                  ? "أنا هنا لمساعدتك في تفاعلات الصوت والاسئلة المتعلقة بالذكاء الاصطناعي"
                  : "I'm here to help with your AI voice interactions and queries"}
              </Typography>
            </Box>

            {/* Language selector (pills) */}
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button
                variant={language === "en" ? "contained" : "outlined"}
                color={language === "en" ? "primary" : "inherit"}
                onClick={() => setLanguage("en")}
                startIcon={<span style={{ fontSize: 18 }}>🇬🇧</span>}
                sx={{
                  textTransform: "none",
                  borderRadius: 50,
                  px: 2,
                  bgcolor: language === "en" ? "#0ea5a4" : "transparent",
                  color: language === "en" ? "#041014" : "#E6EEF8",
                  border:
                    language === "en"
                      ? "none"
                      : "1px solid rgba(255,255,255,0.08)",
                  fontWeight: 600,
                }}
              >
                English
              </Button>

              <Button
                variant={language === "ar" ? "contained" : "outlined"}
                color={language === "ar" ? "primary" : "inherit"}
                onClick={() => setLanguage("ar")}
                startIcon={<span style={{ fontSize: 18 }}>🇸🇦</span>}
                sx={{
                  textTransform: "none",
                  borderRadius: 50,
                  px: 2,
                  bgcolor: language === "ar" ? "#0ea5a4" : "transparent",
                  color: language === "ar" ? "#041014" : "#E6EEF8",
                  border:
                    language === "ar"
                      ? "none"
                      : "1px solid rgba(255,255,255,0.08)",
                  fontWeight: 600,
                }}
              >
                العربية
              </Button>
            </Stack>

            {/* Mic button with circular equalizer rings */}
            <Box
              sx={{
                position: "relative",
                width: { xs: 160, sm: 200 },
                height: { xs: 160, sm: 200 },
                mt: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Animated rings */}
              <Box
                aria-hidden
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  viewBox="0 0 200 200"
                  width="100%"
                  height="100%"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ transform: "translateZ(0)" }}
                >
                  <g transform="translate(100,100)">
                    {[40, 60, 80].map((r, i) => (
                      <circle
                        key={i}
                        cx={0}
                        cy={0}
                        r={r}
                        fill="none"
                        stroke={`rgba(14,184,166,${0.18 - i * 0.06})`}
                        strokeWidth={4 - i} // thinner for outer rings
                        style={{
                          transformOrigin: "center",
                          animation: isListening
                            ? `ringScale ${
                                1600 + i * 300
                              }ms infinite ease-out, ringFade ${
                                1600 + i * 300
                              }ms infinite`
                            : "none",
                        }}
                      />
                    ))}
                  </g>
                </svg>
              </Box>

              {/* Mic circular button */}
              <Button
                onClick={isListening ? stopListening : startListening}
                sx={{
                  width: { xs: 110, sm: 140 },
                  height: { xs: 110, sm: 140 },
                  borderRadius: "50%",
                  background: isListening ? "#EF4444" : "#06B6D4",
                  color: "#fff",
                  boxShadow: isListening
                    ? "0 12px 30px rgba(239,68,68,0.25)"
                    : "0 12px 30px rgba(6,182,212,0.18)",
                  "&:hover": {
                    background: isListening ? "#F87171" : "#0891B2",
                  },
                  fontSize: { xs: 28, sm: 34 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-pressed={isListening}
                aria-label={isListening ? "Stop listening" : "Start listening"}
              >
                <MicNoneIcon sx={{ fontSize: { xs: 40, sm: 48 } }} />
              </Button>
            </Box>

            {/* Status and listening label */}
            <Box sx={{ mt: 1, minHeight: 28 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: isListening ? "#A7F3D0" : "rgba(230,238,248,0.75)",
                  fontWeight: 600,
                }}
              >
                {isListening
                  ? isRtl
                    ? "يتم الاستماع..."
                    : "Listening..."
                  : statusText}
              </Typography>
            </Box>

            {/* small helper */}
            <Typography
              variant="caption"
              sx={{ color: "rgba(230,238,248,0.65)", mt: 1 }}
            >
              <LanguageIcon sx={{ fontSize: 14, mr: 0.5 }} />
              {isRtl
                ? "اختر اللغة ثم اضغط على الزر للتحدث"
                : "Select a language and press the mic to speak"}
            </Typography>
          </Stack>
        </Paper>
      </Box>

      {/* animations definitions */}
      <style>{`
        @keyframes ringScale {
          0% { transform: scale(0.6); opacity: 0.9; }
          60% { transform: scale(1.05); opacity: 0.55; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes ringFade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  );
}
