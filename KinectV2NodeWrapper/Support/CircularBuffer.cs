namespace KinectV2NodeWrapper.Support
{
    using System;
    using System.Collections.Generic;
    
    public class CircularBuffer<T> : List<T>
    {
        private T[] buffer;
        private int capacity = 1024;
        private int index = 0;
        private int count = 0;

        public CircularBuffer()
        {
        }

        public CircularBuffer(IEnumerable<T> collection) : base(collection)
        {
            throw new NotImplementedException();
        }

        public CircularBuffer(int capacity)
        {
            this.capacity = capacity;
            buffer = new T[capacity];
        }

        public new void Add(T obj)
        {
            buffer[index] = obj;
            index = (index + 1) % capacity;
            count++;
        }

        public new IEnumerator<T> GetEnumerator()
        {
            int cursor = count < capacity ? 0 : index;
            if (count == 0)
            {
                yield break;
            }
            else
            {
                for (int i = 0; i < count; i++)
                {
                    yield return buffer[cursor];
                    cursor = (cursor + 1) % capacity;
                }

            }

        }
    }
}
