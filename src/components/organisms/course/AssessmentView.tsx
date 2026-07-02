import { useState } from 'react'
import { toast } from 'sonner'
import { useModuleAssessment, useSubmitAssessment } from '../../../hooks/useModuleAssessments'
import Button from '../../atoms/Button'
import Spinner from '../../atoms/Spinner'
import AssessmentResult from './AssessmentResult'
import { getErrorMessage } from '../../../lib/error'
import type { AttemptResult } from '../../../types'

interface AssessmentViewProps {
  moduleId: number
  onBack: () => void
}

export default function AssessmentView({ moduleId, onBack }: AssessmentViewProps) {
  const { data: assessment, isLoading } = useModuleAssessment(moduleId)
  const submitAssessment = useSubmitAssessment()
  const [selections, setSelections] = useState<Record<number, number>>({})
  const [result, setResult] = useState<AttemptResult | null>(null)

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner />
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">Este módulo no tiene evaluación disponible.</p>
        <Button variant="secondary" onClick={onBack}>Volver</Button>
      </div>
    )
  }

  if (result) {
    return (
      <AssessmentResult
        result={result}
        passingScore={assessment.passing_score}
        onRetry={() => {
          setResult(null)
          setSelections({})
        }}
        onBack={onBack}
      />
    )
  }

  const sortedQuestions = [...assessment.questions].sort((a, b) => a.order_index - b.order_index)
  const allAnswered = sortedQuestions.every((q) => selections[q.id] !== undefined)

  function handleSelect(questionId: number, optionId: number) {
    setSelections((prev) => ({ ...prev, [questionId]: optionId }))
  }

  async function handleSubmit() {
    if (!allAnswered) {
      toast.error('Responde todas las preguntas antes de enviar')
      return
    }
    try {
      const answers = Object.entries(selections).map(([qId, optId]) => ({
        question_id: Number(qId),
        selected_option_id: optId,
      }))
      const res = await submitAssessment.mutateAsync({
        assessmentId: assessment!.id,
        answers,
      })
      setResult(res)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <p className="small text-muted mb-0">Evaluación del módulo</p>
          <p className="small text-muted">
            {sortedQuestions.length} preguntas · Aprobación: {assessment.passing_score}%
          </p>
        </div>
        <Button variant="secondary" onClick={onBack}>Volver</Button>
      </div>

      {sortedQuestions.map((q, qi) => (
        <div key={q.id} className="border rounded-2 p-4 mb-3">
          <p className="fw-medium mb-3">
            <span className="text-bar-600 me-2">{qi + 1}.</span>
            {q.question_text}
            <span className="text-muted ms-2 small">({q.points} pt{q.points > 1 ? 's' : ''})</span>
          </p>
          <div className="d-flex flex-column gap-2">
            {q.options.map((opt) => (
              <label
                key={opt.id}
                className={`d-flex align-items-center gap-3 p-3 border rounded-2 cursor-pointer ${
                  selections[q.id] === opt.id ? 'border-bar-500 bg-bar-50' : 'hover-bg-light'
                }`}
                style={{ cursor: 'pointer' }}
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={selections[q.id] === opt.id}
                  onChange={() => handleSelect(q.id, opt.id)}
                  className="form-check-input m-0"
                />
                <span className="small">{opt.option_text}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-end mt-4">
        <Button onClick={handleSubmit} loading={submitAssessment.isPending} disabled={!allAnswered}>
          Enviar respuestas
        </Button>
      </div>
    </div>
  )
}
