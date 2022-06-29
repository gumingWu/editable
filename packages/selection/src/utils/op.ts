import { OP_DELETE_TEXT, OP_INSERT_NODE, OP_INSERT_TEXT, OP_UPDATE_DATA, OP_UPDATE_FORMAT } from "@editablejs/constants"
import { NodeInterface, Op, Text, Element, TextInterface, createNode } from "@editablejs/model"
import { Log } from "@editablejs/utils"
import Range from '../range'

export const createRangefromOp = (op: (Op & Record<'node', NodeInterface>)) => { 
  const { type, value, node } = op
  let key = node.getKey()
  let offset = op.offset
  switch(type) {
    case OP_UPDATE_FORMAT:
      if(!Text.isText(node)) break
      const text = node.getText()
      return new Range(key, 0, key, text.length)
    case OP_UPDATE_DATA:
        if(Text.isText(node)) {
          const composition = node.getComposition()
          if(composition) {
            const { text, offset } = composition
            return new Range(key, offset + text.length)
          } else return
        }
        break
    case OP_INSERT_TEXT:
      return new Range(key, offset + value.length)
    case OP_DELETE_TEXT:
      return new Range(key, offset)
    case OP_INSERT_NODE:
      if(!node) Log.nodeNotFound(key)
      if(Element.isElement(node)) { 
        let child = createNode(value)
        if(child) {
          const createRange = (textNode: TextInterface) => { 
            return new Range(textNode.getKey(), textNode.getText().length)
          }
          if(Text.isText(child)) {
            return createRange(child)
          } 
          while(child && Element.isElement(child)) {
            const last = child.last()
            if(!last) break
            key = child.getKey()
            offset = child.getChildrenSize()
            if(Text.isText(last)) {
              return createRange(last)
            } else {
              child = last
            }
          }
        }
      }
      
      return new Range(key, offset)
  }
  return new Range(key, offset)
}