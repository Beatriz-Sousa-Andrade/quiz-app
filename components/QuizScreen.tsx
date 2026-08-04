import questions from '../questions.json';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

export default function QuizScreen() {
  const currentQuestion = questions[3];  

  return (
    <View style={styles.container}>
      
      {/* Container do Cabeçalho com a Logo em cima e o Badge/Slogan abaixo */}
      <View style={styles.headerContainer}>
        <Image 
          source={require('../assets/imagem/logo_death_note.jpg')} 
          style={styles.headerImage}
          resizeMode="contain"
        />

        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>DEATH NOTE // ARQUIVO #03</Text>
        </View>
      </View>

      {/* Container para a Pergunta */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      {/* Container para as Alternativas */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => {
          const letters = ['A', 'B', 'C', 'D'];
          return (
            <TouchableOpacity key={option} style={styles.option} activeOpacity={0.8}>
              <View style={styles.optionBadge}>
                <Text style={styles.optionBadgeText}>{letters[index]}</Text>
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    padding: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerImage: {
    width: '90%',
    height: 170,
    marginBottom: 12,
  },
  headerBadge: {
    borderBottomWidth: 1,
    borderBottomColor: '#660000',
    paddingBottom: 4,
  },
  headerBadgeText: {
    color: '#8c8c8c',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
  questionContainer: {
    backgroundColor: '#111112',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#990000',
    padding: 24,
    minHeight: 160,
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f2f2f2',
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: 0.5,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    backgroundColor: '#0d0d0e',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#262629',
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionBadge: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#1a0000',
    borderWidth: 1,
    borderColor: '#800000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionBadgeText: {
    color: '#ff4d4d',
    fontSize: 14,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
    color: '#cccccc',
    fontWeight: '500',
    flex: 1,
  },
});
