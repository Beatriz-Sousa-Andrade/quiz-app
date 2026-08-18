import React, { useState } from "react";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts, SpecialElite_400Regular } from "@expo-google-fonts/special-elite";
import * as Haptics from "expo-haptics";
import questions from "../questions.json";

// Haptics só funcionam em dispositivos nativos (iOS/Android), nunca no browser
const triggerHaptic = (type: "success" | "error") => {
  if (Platform.OS === "web") return;
  if (type === "success") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } else {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
};

export default function QuizScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // A fonte carrega em segundo plano — nunca bloqueia o render
  const [fontsLoaded] = useFonts({ SpecialElite_400Regular });
  const fontFamily = fontsLoaded ? "SpecialElite_400Regular" : undefined;

  const { width } = useWindowDimensions();

  const totalQuestions = questions.length || 1;
  const currentQuestion = questions[currentIndex] || questions[0];

  const isMobile = width < 480;
  const isDesktop = width >= 900;

  const contentMaxWidth = isDesktop ? 560 : "100%";
  
  // Logo levemente maior no celular
  const logoWidth = isMobile ? width * 0.94 : 400;
  const logoHeight = isMobile ? 130 : 150;

  const questionFontSize = isMobile ? 16 : 21;
  const optionFontSize = isMobile ? 13 : 16;

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);

    const selectedText = currentQuestion.options[index];
    const isCorrect = selectedText === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      triggerHaptic("success");
    } else {
      triggerHaptic("error");
    }

    setTimeout(() => {
      setSelectedOption(null);
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsFinished(true);
      }
    }, 550);
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  const getRankMessage = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage === 100) return "CLASSIFICAÇÃO: NOVO L // Sucessor Direto";
    if (percentage >= 60) return "CLASSIFICAÇÃO: MEMBRO DELLA FORÇA-TAREFA";
    return "CLASSIFICAÇÃO: VÍTIMA DE KIRA // Caso Encerrado";
  };

  // ─── TELA DE RESULTADO FINAL (CENTRALIZADA E REESTILIZADA) ────────────────
  if (isFinished) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.finishScreenWrapper}>
          <View style={[styles.content, { maxWidth: contentMaxWidth, width: "100%", alignSelf: "center", alignItems: "center" }]}>
            <View style={[styles.finishContainer, isMobile && { padding: 22 }]}>
              
              <Text style={[styles.finishHeaderTag, { fontFamily }]}>
                [ NPA INVESTIGATION DIVISION ]
              </Text>

              <Text style={[styles.questionText, { fontFamily, fontSize: questionFontSize + 2, marginBottom: 20, textAlign: "center", color: "#fff" }]}>
                INVESTIGAÇÃO CONCLUÍDA
              </Text>

              <View style={styles.finishDivider} />

              <View style={styles.scoreBox}>
                <Text style={[styles.bodyText, { fontFamily, textAlign: "center", fontSize: isMobile ? 14 : 16, color: "#c2bcad" }]}>
                  Pontuação Final:
                </Text>
                <Text style={[styles.scoreNumber, { fontFamily }]}>
                  {score} / {totalQuestions}
                </Text>
              </View>

              <Text style={[styles.rankText, { fontFamily, textAlign: "center", marginBottom: 30, fontSize: isMobile ? 13 : 14 }]}>
                {getRankMessage()}
              </Text>

              <TouchableOpacity style={styles.nextButton} activeOpacity={0.8} onPress={handleRestartQuiz}>
                <Text style={[styles.nextButtonText, { fontFamily }]}>REINICIAR ARQUIVO</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ─── TELA DE PERGUNTAS ───────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, isMobile && { paddingTop: 40, paddingBottom: 16 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.content, { maxWidth: contentMaxWidth, width: "100%", alignSelf: "center" }]}>

          {/* Cabeçalho */}
          <View style={[styles.headerContainer, isMobile && { marginBottom: 22 }]}>
            <Image
              source={require("../assets/imagem/logo_death_note.jpg")}
              style={{ width: logoWidth, height: logoHeight, marginBottom: 4 }}
              resizeMode="contain"
            />
            <View style={styles.headerBadge}>
              <Text style={[styles.headerBadgeText, { fontFamily }]}>
                DEATH NOTE // ARQUIVO Nº {String(currentIndex + 1).padStart(2, "0")}{" "}
                / {String(totalQuestions).padStart(2, "0")}
              </Text>
            </View>
          </View>

          {/* Pergunta */}
          <View style={[styles.questionContainer, isMobile && { padding: 16, minHeight: 110, marginBottom: 14 }]}>
            <Text style={[styles.questionText, { fontFamily, fontSize: questionFontSize }]}>
              {currentQuestion.question}
            </Text>
          </View>

          {/* Alternativas */}
          <View style={[styles.optionsContainer, isMobile && { gap: 8 }]}>
            {currentQuestion.options &&
              currentQuestion.options.map((option: string, index: number) => {
                const letters = ["A", "B", "C", "D"];
                const isSelected = selectedOption === index;
                const isCorrectAnswer = option === currentQuestion.correctAnswer;
                const hasAnswered = selectedOption !== null;

                const optionBg = hasAnswered
                  ? isSelected
                    ? isCorrectAnswer ? styles.optionCorrect : styles.optionWrong
                    : styles.option
                  : styles.option;

                const badgeBg = hasAnswered
                  ? isSelected
                    ? isCorrectAnswer ? styles.badgeCorrect : styles.badgeWrong
                    : styles.optionBadge
                  : styles.optionBadge;

                const badgeTextCol = hasAnswered
                  ? isSelected
                    ? isCorrectAnswer ? styles.badgeTextCorrect : styles.badgeTextWrong
                    : styles.optionBadgeText
                  : styles.optionBadgeText;

                const textCol = hasAnswered
                  ? isSelected
                    ? isCorrectAnswer ? styles.textCorrect : styles.textWrong
                    : styles.bodyText
                  : styles.bodyText;

                const opacityStyle = hasAnswered && !isSelected ? 0.4 : 1;
                const isStrikethrough = hasAnswered && isSelected && !isCorrectAnswer;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.option,
                      optionBg,
                      { opacity: opacityStyle },
                      isMobile && { paddingVertical: 12, paddingHorizontal: 12 },
                    ]}
                    activeOpacity={hasAnswered ? 1 : 0.7}
                    onPress={() => handleSelectOption(index)}
                    disabled={hasAnswered}
                  >
                    <View style={[styles.optionBadge, badgeBg, isMobile && { width: 26, height: 26, marginRight: 10 }]}>
                      <Text style={[styles.optionBadgeText, badgeTextCol, { fontFamily }, isMobile && { fontSize: 12 }]}>
                        {letters[index] || "?"}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.bodyText,
                        textCol,
                        { fontFamily, fontSize: optionFontSize },
                        isStrikethrough && { textDecorationLine: "line-through" },
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#070707",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    padding: 16,
  },
  finishScreenWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  content: {
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  headerBadge: {
    borderBottomWidth: 1,
    borderBottomColor: "#5c1a1a",
    paddingBottom: 4,
  },
  headerBadgeText: {
    color: "#8c8c8c",
    fontSize: 10,
    letterSpacing: 2,
    textAlign: "center",
  },
  questionContainer: {
    backgroundColor: "#141210",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#422121",
    padding: 22,
    minHeight: 130,
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#2b0000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  finishContainer: {
    backgroundColor: "#12100e",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#5c1a1a",
    padding: 28,
    width: "100%",
    alignItems: "center",
    shadowColor: "#3a0505",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  finishHeaderTag: {
    color: "#8c8c8c",
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 12,
  },
  finishDivider: {
    width: "80%",
    height: 1,
    backgroundColor: "#3d1919",
    marginBottom: 20,
  },
  scoreBox: {
    backgroundColor: "#0a0908",
    borderWidth: 1,
    borderColor: "#2a1515",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 3,
    marginBottom: 20,
    alignItems: "center",
    width: "100%",
  },
  scoreNumber: {
    color: "#f0ece1",
    fontSize: 28,
    letterSpacing: 2,
    marginTop: 4,
  },
  questionText: {
    color: "#f0ece1",
    textAlign: "center",
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  bodyText: {
    color: "#b8b8b8",
    flex: 1,
  },
  optionsContainer: {
    gap: 10,
  },
  option: {
    backgroundColor: "#0f0f0f",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#222222",
    flexDirection: "row",
    alignItems: "center",
  },
  optionBadge: {
    width: 28,
    height: 28,
    borderRadius: 3,
    backgroundColor: "#170a0a",
    borderWidth: 1,
    borderColor: "#6b1d1d",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionBadgeText: {
    color: "#d64545",
    fontSize: 13,
  },
  optionCorrect: {
    backgroundColor: "#111a11",
    borderColor: "#3d6b3d",
  },
  badgeCorrect: {
    backgroundColor: "#142914",
    borderColor: "#3d6b3d",
  },
  badgeTextCorrect: {
    color: "#4ec94e",
  },
  textCorrect: {
    color: "#d4ffd4",
    flex: 1,
  },
  optionWrong: {
    backgroundColor: "#1a1111",
    borderColor: "#7a1f1f",
  },
  badgeWrong: {
    backgroundColor: "#2b1212",
    borderColor: "#7a1f1f",
  },
  badgeTextWrong: {
    color: "#ff4d4d",
  },
  textWrong: {
    color: "#ffb3b3",
    flex: 1,
  },
  nextButton: {
    marginTop: 8,
    backgroundColor: "#1c0d0d",
    borderWidth: 1,
    borderColor: "#8a2222",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: "center",
    width: "100%",
  },
  nextButtonText: {
    color: "#f0ece1",
    letterSpacing: 2,
    fontSize: 13,
  },
  rankText: {
    color: "#d64545",
    fontSize: 12,
    letterSpacing: 1,
  },
});

